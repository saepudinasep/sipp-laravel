<?php

namespace App\Http\Controllers;

use App\Models\Spp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SppController extends Controller
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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tahunAjaranList = Spp::select('tahun_ajaran')
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        $tahunAjaran = $request->input('tahun_ajaran', $tahunAjaranList->first());

        $spp = Spp::query()
            ->when($tahunAjaran, fn($q) => $q->where('tahun_ajaran', $tahunAjaran))
            ->orderBy('jenis')
            ->orderBy('bulan')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'jenis' => $s->jenis,
                'nominal' => (float) $s->nominal,
                'bulan' => $s->bulan,
                'bulan_label' => self::NAMA_BULAN[$s->bulan] ?? $s->bulan,
                'tahun_ajaran' => $s->tahun_ajaran,
            ]);

        return Inertia::render('Admin/Spp/Index', [
            'sppList' => $spp,
            'tahunAjaranList' => $tahunAjaranList,
            'bulanList' => collect(self::NAMA_BULAN)->map(fn($label, $angka) => [
                'value' => $angka,
                'label' => $label,
            ])->values(),
            'filters' => [
                'tahun_ajaran' => $tahunAjaran,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tahunAjaranList = Spp::select('tahun_ajaran')
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        return Inertia::render('Admin/Spp/Create', [
            'tahunAjaranList' => $tahunAjaranList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => ['required', 'string', 'max:50'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'tahun_ajaran' => ['required', 'string', 'max:10'],
        ], [
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi, contoh: 2026/2027.',
        ]);

        $bulanSudahAda = Spp::where('jenis', $validated['jenis'])
            ->where('tahun_ajaran', $validated['tahun_ajaran'])
            ->pluck('bulan')
            ->all();

        $bulanBaru = array_diff(range(1, 12), $bulanSudahAda);

        if (empty($bulanBaru)) {
            return back()
                ->withErrors(['jenis' => 'SPP ini untuk seluruh 12 bulan di tahun ajaran tersebut sudah ada.'])
                ->withInput();
        }

        DB::transaction(function () use ($validated, $bulanBaru) {
            $now = now();

            $rows = array_map(fn($bulan) => [
                'jenis' => $validated['jenis'],
                'nominal' => $validated['nominal'],
                'bulan' => $bulan,
                'tahun_ajaran' => $validated['tahun_ajaran'],
                'created_at' => $now,
                'updated_at' => $now,
            ], $bulanBaru);

            Spp::insert($rows);
        });

        $jumlahDibuat = count($bulanBaru);
        $jumlahDilewati = count($bulanSudahAda);

        $pesan = "SPP berhasil dibuat untuk {$jumlahDibuat} bulan.";
        if ($jumlahDilewati > 0) {
            $pesan .= " {$jumlahDilewati} bulan dilewati karena sudah ada sebelumnya.";
        }

        return redirect()
            ->route('admin.spp.index', ['tahun_ajaran' => $validated['tahun_ajaran']])
            ->with('success', $pesan);
    }

    /**
     * Display the specified resource.
     */
    public function show(Spp $spp)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Spp $spp)
    {
        return Inertia::render('Admin/Spp/Edit', [
            'spp' => [
                'id' => $spp->id,
                'jenis' => $spp->jenis,
                'nominal' => (float) $spp->nominal,
                'bulan' => $spp->bulan,
                'tahun_ajaran' => $spp->tahun_ajaran,
            ],
            'bulanList' => collect(self::NAMA_BULAN)->map(fn($label, $angka) => [
                'value' => $angka,
                'label' => $label,
            ])->values(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Spp $spp)
    {
        $validated = $request->validate([
            'jenis' => ['required', 'string', 'max:50'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'bulan' => ['required', 'integer', 'between:1,12'],
            'tahun_ajaran' => ['required', 'string', 'max:10'],
        ]);

        $duplikat = Spp::where('jenis', $validated['jenis'])
            ->where('bulan', $validated['bulan'])
            ->where('tahun_ajaran', $validated['tahun_ajaran'])
            ->where('id', '!=', $spp->id)
            ->exists();

        if ($duplikat) {
            return back()
                ->withErrors(['jenis' => 'SPP dengan jenis, bulan, dan tahun ajaran yang sama sudah ada.'])
                ->withInput();
        }

        $spp->update($validated);

        return redirect()
            ->route('admin.spp.index', ['tahun_ajaran' => $validated['tahun_ajaran']])
            ->with('success', 'Data SPP berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Spp $spp)
    {
        if ($spp->transaksi()->exists()) {
            return back()->with('error', 'SPP tidak dapat dihapus karena sudah memiliki transaksi pembayaran.');
        }

        $spp->delete();

        return redirect()
            ->route('admin.spp.index', ['tahun_ajaran' => $spp->tahun_ajaran])
            ->with('success', 'Data SPP berhasil dihapus.');
    }

    /**
     * Hapus SEMUA bulan untuk satu kombinasi jenis + tahun ajaran sekaligus
     * — pasangan dari store() yang membuat 12 bulan sekaligus. Baris yang
     * sudah punya transaksi pembayaran tidak ikut terhapus (dilindungi),
     * sisanya tetap dihapus.
     */
    public function destroyBulk(Request $request)
    {
        $validated = $request->validate([
            'jenis' => ['required', 'string', 'max:50'],
            'tahun_ajaran' => ['required', 'string', 'max:10'],
        ]);

        $group = Spp::where('jenis', $validated['jenis'])
            ->where('tahun_ajaran', $validated['tahun_ajaran'])
            ->get();

        $terpakai = $group->filter(fn($spp) => $spp->transaksi()->exists());
        $bisaDihapus = $group->reject(fn($spp) => $terpakai->contains('id', $spp->id));

        foreach ($bisaDihapus as $spp) {
            $spp->delete();
        }

        $pesan = "{$bisaDihapus->count()} bulan SPP berhasil dihapus.";
        if ($terpakai->isNotEmpty()) {
            $pesan .= " {$terpakai->count()} bulan tidak dapat dihapus karena sudah memiliki transaksi.";
        }

        return redirect()
            ->route('admin.spp.index', ['tahun_ajaran' => $validated['tahun_ajaran']])
            ->with($terpakai->isNotEmpty() ? 'error' : 'success', $pesan);
    }
}
