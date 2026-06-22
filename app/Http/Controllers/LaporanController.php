<?php

namespace App\Http\Controllers;

use App\Exports\LaporanSppExport;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class LaporanController extends Controller
{
    /** Nama bulan dalam Bahasa Indonesia, dipakai untuk menampilkan label SPP. */
    public const NAMA_BULAN = [
        1 => 'Januari',
        2 => 'Februari',
        3 => 'Maret',
        4 => 'April',
        5 => 'Mei',
        6 => 'Juni',
        7 => 'Juli',
        8 => 'Agustus',
        9 => 'September',
        10 => 'Oktober',
        11 => 'November',
        12 => 'Desember',
    ];

    /**
     * Halaman Laporan Pembayaran SPP — khusus Admin.
     *
     * Berbeda dengan Histori Pembayaran (yang basisnya transaksi yang
     * sudah terjadi), Laporan basisnya adalah seluruh SISWA untuk SPP
     * (bulan + tahun ajaran) tertentu, termasuk yang BELUM membayar —
     * supaya bisa dipakai untuk menagih, bukan hanya mencatat histori.
     */
    public function index(Request $request)
    {
        $data = $this->buildLaporanData($request);

        return Inertia::render('Admin/Laporan/Index', [
            'bulanList' => $data['bulanList'],
            'tahunAjaranList' => $data['tahunAjaranList'],
            'kelasList' => $data['kelasList'],
            'filters' => $data['filters'],
            'sudahGenerate' => $data['sudahGenerate'],
            'detail' => $data['detail'],
            'summary' => $data['summary'],
            'totalTerkumpul' => $data['totalTerkumpul'],
            'bulanLabel' => $data['bulanLabel'],
            'kelasLabel' => $data['kelasLabel'],
            'dicetakOleh' => $data['dicetakOleh'],
        ]);
    }

    /**
     * Export laporan yang sedang tampil ke file Excel (.xlsx).
     * Memakai filter query string yang sama dengan halaman index.
     */
    public function exportExcel(Request $request)
    {
        $data = $this->buildLaporanData($request);

        $this->abortIfBelumGenerate($data);

        $namaFile = sprintf(
            'laporan-spp-%s-%s.xlsx',
            str_replace(['/', ' '], '-', $data['filters']['tahun_ajaran']),
            strtolower($data['bulanLabel']),
        );

        return Excel::download(new LaporanSppExport($data), $namaFile);
    }

    /**
     * Export laporan yang sedang tampil ke file PDF.
     * Memakai filter query string yang sama dengan halaman index.
     */
    public function exportPdf(Request $request)
    {
        $data = $this->buildLaporanData($request);

        $this->abortIfBelumGenerate($data);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.pdf', $data)
            ->setPaper('a4', 'portrait');

        $namaFile = sprintf(
            'laporan-spp-%s-%s.pdf',
            str_replace(['/', ' '], '-', $data['filters']['tahun_ajaran']),
            strtolower($data['bulanLabel']),
        );

        return $pdf->download($namaFile);
    }

    /**
     * Pastikan filter bulan & tahun ajaran sudah dipilih sebelum export
     * dijalankan — mencegah download file laporan kosong/tanpa konteks.
     */
    protected function abortIfBelumGenerate(array $data): void
    {
        abort_if(!$data['sudahGenerate'], 422, 'Pilih bulan dan tahun ajaran terlebih dahulu sebelum mengekspor laporan.');
    }

    /**
     * Logic inti pengambilan data laporan, dipakai bersama oleh halaman
     * index, export Excel, dan export PDF — supaya hasil export selalu
     * identik dengan yang ditampilkan di halaman.
     */
    protected function buildLaporanData(Request $request): array
    {
        $bulan = $request->input('bulan');
        $tahunAjaran = $request->input('tahun_ajaran');
        $kelasId = $request->input('kelas_id');

        $tahunAjaranList = Spp::select('tahun_ajaran')
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        $bulanList = collect(self::NAMA_BULAN)->map(fn($label, $angka) => [
            'value' => $angka,
            'label' => $label,
        ])->values();

        $kelasList = Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']);

        $sudahGenerate = $request->filled('bulan') && $request->filled('tahun_ajaran');

        $detail = collect();
        $summary = ['total_siswa' => 0, 'sudah_bayar' => 0, 'belum_bayar' => 0];
        $totalTerkumpul = 0;
        $spp = null;

        if ($sudahGenerate) {
            $spp = Spp::where('bulan', $bulan)
                ->where('tahun_ajaran', $tahunAjaran)
                ->first();

            $siswas = Siswa::with('kelas')
                ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId))
                ->orderBy('nama')
                ->get();

            // Map siswa_id -> transaksi, hanya untuk SPP yang sedang dilihat.
            $transaksiPerSiswa = $spp
                ? Transaksi::where('spp_id', $spp->id)
                ->whereIn('siswa_id', $siswas->pluck('id'))
                ->get()
                ->keyBy('siswa_id')
                : collect();

            $detail = $siswas->map(function ($siswa, $i) use ($transaksiPerSiswa, $spp) {
                $transaksi = $transaksiPerSiswa->get($siswa->id);

                return [
                    'no' => $i + 1,
                    'nis' => $siswa->nis,
                    'nama' => $siswa->nama,
                    'kelas' => $siswa->kelas->nama_kelas ?? '—',
                    'jenis_spp' => $spp->jenis ?? '—',
                    'tgl_bayar' => $transaksi?->tgl_bayar?->format('Y-m-d'),
                    'nominal' => $transaksi ? (float) $transaksi->nominal : null,
                    'lunas' => $transaksi !== null,
                ];
            })->values();

            $summary['total_siswa'] = $siswas->count();
            $summary['sudah_bayar'] = $transaksiPerSiswa->count();
            $summary['belum_bayar'] = $summary['total_siswa'] - $summary['sudah_bayar'];
            $totalTerkumpul = $transaksiPerSiswa->sum('nominal');
        }

        $bulanLabel = $bulan ? (self::NAMA_BULAN[$bulan] ?? null) : null;

        return [
            'bulanList' => $bulanList,
            'tahunAjaranList' => $tahunAjaranList,
            'kelasList' => $kelasList,
            'filters' => [
                'bulan' => $bulan,
                'tahun_ajaran' => $tahunAjaran,
                'kelas_id' => $kelasId,
            ],
            'sudahGenerate' => $sudahGenerate,
            'detail' => $detail,
            'summary' => $summary,
            'totalTerkumpul' => (float) $totalTerkumpul,
            'bulanLabel' => $bulanLabel,
            'kelasLabel' => $kelasId
                ? ($kelasList->firstWhere('id', (int) $kelasId)->nama_kelas ?? 'Semua Kelas')
                : 'Semua Kelas',
            'dicetakOleh' => Auth::user()->email,
        ];
    }
}
