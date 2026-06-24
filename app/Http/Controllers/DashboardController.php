<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /** Nama bulan dalam Bahasa Indonesia, dipakai untuk label SPP. */
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

    /** Singkatan bulan untuk label chart (Agu, Sep, dst). */
    public const SINGKATAN_BULAN = [
        1 => 'Jan',
        2 => 'Feb',
        3 => 'Mar',
        4 => 'Apr',
        5 => 'Mei',
        6 => 'Jun',
        7 => 'Jul',
        8 => 'Agu',
        9 => 'Sep',
        10 => 'Okt',
        11 => 'Nov',
        12 => 'Des',
    ];

    /**
     * Dashboard Admin — ringkasan keseluruhan sekolah: total siswa,
     * status pembayaran bulan berjalan, tren 6 bulan terakhir, dan
     * aktivitas transaksi terbaru.
     */
    public function admin()
    {
        $totalSiswa = Siswa::count();
        $totalKelas = Kelas::count();

        // SPP "bulan ini" didekati dari tahun ajaran terbaru + bulan
        // kalender sekarang, karena tidak ada kolom status periode aktif
        // di skema saat ini.
        $bulanIni = (int) now()->format('n');
        $tahunAjaranTerbaru = Spp::orderByDesc('tahun_ajaran')->value('tahun_ajaran');

        $sppBulanIni = Spp::where('bulan', $bulanIni)
            ->where('tahun_ajaran', $tahunAjaranTerbaru)
            ->first();

        $sudahBayar = $sppBulanIni
            ? Transaksi::where('spp_id', $sppBulanIni->id)->count()
            : 0;
        $belumBayar = max($totalSiswa - $sudahBayar, 0);

        $totalPemasukanBulanIni = $sppBulanIni
            ? (float) Transaksi::where('spp_id', $sppBulanIni->id)->sum('nominal')
            : 0;

        // Tren 6 bulan terakhir (kalender, bukan tahun ajaran) — total
        // nominal transaksi per bulan, dari yang terlama ke terbaru.
        $trenBulanan = collect(range(5, 0))->map(function ($mundur) {
            $tanggal = now()->subMonths($mundur);
            $totalBulan = Transaksi::whereYear('tgl_bayar', $tanggal->year)
                ->whereMonth('tgl_bayar', $tanggal->month)
                ->sum('nominal');

            return [
                'label' => self::SINGKATAN_BULAN[$tanggal->month],
                'total' => (float) $totalBulan,
            ];
        });

        $maxTren = $trenBulanan->max('total') ?: 1;
        $trenBulanan = $trenBulanan->map(fn($t, $i) => [
            ...$t,
            'persen' => max(8, round(($t['total'] / $maxTren) * 100)),
            'aktif' => $i === $trenBulanan->count() - 1,
        ])->values();

        // Aktivitas terkini: 4 transaksi terbaru, lintas seluruh sekolah.
        $aktivitas = Transaksi::with(['siswa.kelas', 'spp'])
            ->orderByDesc('created_at')
            ->limit(4)
            ->get()
            ->map(fn($t) => [
                'nama' => $t->siswa->nama ?? '—',
                'kelas' => $t->siswa->kelas->nama_kelas ?? '—',
                'keterangan' => ($t->spp->jenis ?? 'SPP') . ' ' . (self::NAMA_BULAN[$t->spp->bulan] ?? ''),
                'waktu' => $t->created_at->diffForHumans(),
                'nominal' => (float) $t->nominal,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_siswa' => $totalSiswa,
                'total_kelas' => $totalKelas,
                'sudah_bayar' => $sudahBayar,
                'belum_bayar' => $belumBayar,
                'persen_sudah_bayar' => $totalSiswa > 0 ? round($sudahBayar / $totalSiswa * 100, 1) : 0,
                'persen_belum_bayar' => $totalSiswa > 0 ? round($belumBayar / $totalSiswa * 100, 1) : 0,
                'total_pemasukan_bulan_ini' => $totalPemasukanBulanIni,
                'bulan_label' => self::NAMA_BULAN[$bulanIni] ?? '',
                'tahun_ajaran' => $tahunAjaranTerbaru,
            ],
            'tren' => $trenBulanan,
            'aktivitas' => $aktivitas,
        ]);
    }

    /**
     * Dashboard Petugas — ringkasan transaksi yang dia input sendiri:
     * berapa transaksi hari ini, total nominal, dan siswa unik yang
     * sudah membayar lewat dirinya.
     */
    public function petugas()
    {
        $petugas = Auth::user()->petugas;

        $transaksiHariIniQuery = Transaksi::where('petugas_id', $petugas->id ?? 0)
            ->whereDate('tgl_bayar', now()->toDateString());

        $transaksiHariIni = (clone $transaksiHariIniQuery)->count();
        $totalNominalHariIni = (float) (clone $transaksiHariIniQuery)->sum('nominal');
        $siswaUnikHariIni = (clone $transaksiHariIniQuery)->distinct('siswa_id')->count('siswa_id');

        $aktivitas = Transaksi::with(['siswa.kelas', 'spp'])
            ->where('petugas_id', $petugas->id ?? 0)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($t) => [
                'nama' => $t->siswa->nama ?? '—',
                'kelas' => $t->siswa->kelas->nama_kelas ?? '—',
                'keterangan' => ($t->spp->jenis ?? 'SPP') . ' ' . (self::NAMA_BULAN[$t->spp->bulan] ?? ''),
                'waktu' => $t->created_at->diffForHumans(),
                'nominal' => (float) $t->nominal,
            ]);

        return Inertia::render('Petugas/Dashboard', [
            'petugasNama' => $petugas->nama ?? Auth::user()->email,
            'stats' => [
                'transaksi_hari_ini' => $transaksiHariIni,
                'total_nominal_hari_ini' => $totalNominalHariIni,
                'siswa_unik_hari_ini' => $siswaUnikHariIni,
            ],
            'aktivitas' => $aktivitas,
        ]);
    }

    /**
     * Dashboard Siswa — status pembayaran dirinya sendiri: berapa bulan
     * sudah lunas, berapa yang belum, total dibayar, dan sisa tunggakan.
     */
    public function siswa()
    {
        $siswa = Auth::user()->siswa->with('kelas')->first();

        if (!$siswa) {
            return Inertia::render('Siswa/Dashboard', [
                'siswa' => null,
                'stats' => null,
                'bulanStatus' => [],
                'riwayat' => [],
            ]);
        }

        $tahunAjaranAktif = Spp::orderByDesc('tahun_ajaran')->value('tahun_ajaran');

        $sppTahunIni = Spp::where('tahun_ajaran', $tahunAjaranAktif)
            ->orderBy('bulan')
            ->get();

        $transaksiSiswa = Transaksi::where('siswa_id', $siswa->id)
            ->whereIn('spp_id', $sppTahunIni->pluck('id'))
            ->get()
            ->keyBy('spp_id');

        $bulanLunas = $transaksiSiswa->count();
        $bulanBelum = $sppTahunIni->count() - $bulanLunas;
        $totalDibayar = (float) $transaksiSiswa->sum('nominal');

        $nominalRataRata = $sppTahunIni->count() > 0
            ? (float) $sppTahunIni->avg('nominal')
            : 0;
        $sisaTunggakan = $bulanBelum * $nominalRataRata;

        $bulanStatus = $sppTahunIni->map(fn($spp) => [
            'bulan_label' => self::NAMA_BULAN[$spp->bulan] ?? $spp->bulan,
            'tahun_ajaran' => $spp->tahun_ajaran,
            'lunas' => $transaksiSiswa->has($spp->id),
        ])->values();

        $riwayat = Transaksi::with('petugas')
            ->where('siswa_id', $siswa->id)
            ->whereIn('spp_id', $sppTahunIni->pluck('id'))
            ->orderByDesc('tgl_bayar')
            ->limit(10)
            ->get()
            ->map(function ($t) use ($sppTahunIni) {
                $spp = $sppTahunIni->firstWhere('id', $t->spp_id);

                return [
                    'tgl_bayar' => $t->tgl_bayar->format('Y-m-d'),
                    'jenis_spp' => ($spp->jenis ?? 'SPP') . ' · ' . (self::NAMA_BULAN[$spp->bulan ?? 0] ?? ''),
                    'nominal' => (float) $t->nominal,
                    'petugas_nama' => $t->petugas->nama ?? '—',
                ];
            });

        return Inertia::render('Siswa/Dashboard', [
            'siswa' => [
                'nama' => $siswa->nama,
                'nis' => $siswa->nis,
                'kelas' => $siswa->kelas->nama_kelas ?? '—',
                'tahun_ajaran' => $tahunAjaranAktif,
            ],
            'stats' => [
                'bulan_lunas' => $bulanLunas,
                'bulan_belum' => $bulanBelum,
                'total_bulan' => $sppTahunIni->count(),
                'total_dibayar' => $totalDibayar,
                'sisa_tunggakan' => $sisaTunggakan,
            ],
            'bulanStatus' => $bulanStatus,
            'riwayat' => $riwayat,
        ]);
    }
}
