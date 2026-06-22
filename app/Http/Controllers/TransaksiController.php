<?php

namespace App\Http\Controllers;

use App\Models\LogTransaksi;
use App\Models\Petugas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\Transaksi;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransaksiController extends Controller
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
     * Halaman Entri Pembayaran (form input transaksi).
     *
     * Khusus role Petugas. Tabel `transaksis` mewajibkan `petugas_id`
     * (foreign key ke tabel `petugas`), dan Admin tidak memiliki baris
     * di tabel tersebut — sehingga secara skema data, entri pembayaran
     * tidak bisa diwakilkan ke Admin. Admin hanya melihat hasilnya lewat
     * Histori Pembayaran.
     */
    public function index(Request $request)
    {
        $petugasAktif = Auth::user()->petugas;

        $siswaTerpilih = null;
        $sppBelumLunas = [];
        $statusBulan = [];

        if ($request->filled('siswa_id')) {
            $siswaTerpilih = Siswa::with('kelas')->find($request->input('siswa_id'));

            if ($siswaTerpilih) {
                $sudahDibayarIds = Transaksi::where('siswa_id', $siswaTerpilih->id)
                    ->pluck('spp_id');

                $sppBelumLunas = Spp::orderBy('tahun_ajaran')
                    ->orderBy('bulan')
                    ->get()
                    ->reject(fn($spp) => $sudahDibayarIds->contains($spp->id))
                    ->map(fn($spp) => [
                        'id' => $spp->id,
                        'jenis' => $spp->jenis,
                        'bulan' => $spp->bulan,
                        'bulan_label' => self::NAMA_BULAN[$spp->bulan] ?? $spp->bulan,
                        'tahun_ajaran' => $spp->tahun_ajaran,
                        'nominal' => (float) $spp->nominal,
                        'label' => "{$spp->jenis} — " . (self::NAMA_BULAN[$spp->bulan] ?? $spp->bulan) . " ({$spp->tahun_ajaran})",
                    ])
                    ->values();

                $semuaSpp = Spp::orderBy('tahun_ajaran')->orderBy('bulan')->get();
                $statusBulan = $semuaSpp->map(function ($spp) use ($sudahDibayarIds) {
                    return [
                        'bulan_label' => self::NAMA_BULAN[$spp->bulan] ?? $spp->bulan,
                        'tahun_ajaran' => $spp->tahun_ajaran,
                        'lunas' => $sudahDibayarIds->contains($spp->id),
                    ];
                })->values();
            }
        }

        return Inertia::render('Petugas/Transaksi/Index', [
            'siswaTerpilih' => $siswaTerpilih,
            'sppBelumLunas' => $sppBelumLunas,
            'statusBulan' => $statusBulan,
            'petugasNama' => $petugasAktif->nama ?? Auth::user()->email,
        ]);
    }

    /**
     * Halaman Histori Pembayaran — daftar transaksi yang tercatat, dengan
     * scope berbeda sesuai role:
     *  - Admin   : melihat seluruh transaksi semua siswa & petugas.
     *  - Petugas : default hanya transaksi miliknya sendiri, namun bisa
     *              memilih petugas lain lewat filter dropdown.
     *  - Siswa   : hanya transaksi miliknya sendiri, tanpa filter siswa.
     */
    public function histori(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;

        $search = $request->input('search');
        $bulan = $request->input('bulan');
        $kelasId = $request->input('kelas_id');
        $petugasIdFilter = $request->input('petugas_id');

        $query = Transaksi::query()->with(['siswa.kelas', 'spp', 'petugas']);

        if ($role === 'siswa') {
            // Siswa hanya boleh melihat transaksi miliknya sendiri —
            // tidak ada filter siswa/petugas untuk role ini.
            $siswaAktif = $user->siswa;
            $query->where('siswa_id', $siswaAktif->id ?? 0);
        } elseif ($role === 'petugas') {
            $petugasAktif = $user->petugas;

            // Default ke transaksi milik petugas yang login. Jika user
            // memilih petugas lain lewat filter, gunakan pilihan tersebut.
            $query->where('petugas_id', $petugasIdFilter ?: ($petugasAktif->id ?? 0));
        } elseif ($petugasIdFilter) {
            // Admin: filter petugas bersifat opsional (default lihat semua).
            $query->where('petugas_id', $petugasIdFilter);
        }

        $transaksis = $query
            ->when($search && $role !== 'siswa', function ($q) use ($search) {
                $q->whereHas('siswa', function ($sub) use ($search) {
                    $sub->where('nama', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($bulan, function ($q) use ($bulan) {
                $q->whereHas('spp', function ($sub) use ($bulan) {
                    $sub->where('bulan', $bulan);
                });
            })
            ->when($kelasId && $role !== 'siswa', function ($q) use ($kelasId) {
                $q->whereHas('siswa', function ($sub) use ($kelasId) {
                    $sub->where('kelas_id', $kelasId);
                });
            })
            ->orderByDesc('tgl_bayar')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $transaksis->getCollection()->transform(function ($t) {
            return [
                'id' => $t->id,
                'tgl_bayar' => $t->tgl_bayar->format('Y-m-d'),
                'siswa_nama' => $t->siswa->nama ?? '—',
                'kelas' => $t->siswa->kelas->nama_kelas ?? null,
                'spp_jenis' => $t->spp->jenis ?? '—',
                'spp_bulan_label' => self::NAMA_BULAN[$t->spp->bulan] ?? '',
                'nominal' => (float) $t->nominal,
                'petugas_nama' => $t->petugas->nama ?? '—',
                'keterangan' => $t->keterangan,
            ];
        });

        $page = match ($role) {
            'admin' => 'Admin/Histori/Index',
            'petugas' => 'Petugas/Histori/Index',
            default => 'Siswa/Histori/Index',
        };

        $props = [
            'transaksis' => $transaksis,
            'bulanList' => collect(self::NAMA_BULAN)->map(fn($label, $angka) => [
                'value' => $angka,
                'label' => $label,
            ])->values(),
            'filters' => [
                'search' => $search,
                'bulan' => $bulan,
                'kelas_id' => $kelasId,
                'petugas_id' => $petugasIdFilter,
            ],
        ];

        // Filter kelas & siswa hanya relevan untuk Admin/Petugas, bukan Siswa
        // (siswa hanya melihat datanya sendiri, kelasnya sudah pasti).
        if ($role !== 'siswa') {
            $props['kelasList'] = Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']);
        }

        // Dropdown filter "lihat punya petugas lain" hanya untuk role petugas.
        if ($role === 'petugas') {
            $props['petugasList'] = Petugas::orderBy('nama')->get(['id', 'nama']);
        }

        return Inertia::render($page, $props);
    }

    /**
     * Pencarian siswa (live search) berdasarkan nama atau NIS.
     * Dipanggil dari form entri pembayaran (Admin maupun Petugas).
     */
    public function searchSiswa(Request $request)
    {
        $query = trim((string) $request->input('q', ''));

        if (mb_strlen($query) < 3) {
            return response()->json([]);
        }

        $siswa = Siswa::with('kelas')
            ->where(function ($q) use ($query) {
                $q->where('nama', 'like', "%{$query}%")
                    ->orWhere('nis', 'like', "%{$query}%");
            })
            ->orderBy('nama')
            ->limit(8)
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'nama' => $s->nama,
                'nis' => $s->nis,
                'kelas' => $s->kelas?->nama_kelas,
            ]);

        return response()->json($siswa);
    }

    /**
     * Simpan transaksi pembayaran baru.
     */
    public function create()
    {
        //
    }

    /**
     * Simpan transaksi pembayaran baru. Hanya bisa diakses oleh Petugas;
     * petugas penerima selalu diambil dari data petugas milik user yang
     * login (bukan dari input/pilihan manapun).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => ['required', 'exists:siswas,id'],
            'spp_id' => ['required', 'exists:spps,id'],
            'tgl_bayar' => ['required', 'date'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $petugasAktif = Auth::user()->petugas;

        if (!$petugasAktif) {
            return back()->with('error', 'Akun Anda tidak terhubung ke data petugas.');
        }

        $spp = Spp::findOrFail($validated['spp_id']);

        $sudahLunas = Transaksi::where('siswa_id', $validated['siswa_id'])
            ->where('spp_id', $validated['spp_id'])
            ->exists();

        if ($sudahLunas) {
            return back()->with('error', 'SPP untuk bulan tersebut sudah dibayar sebelumnya.');
        }

        $transaksi = DB::transaction(function () use ($validated, $petugasAktif, $spp) {
            $transaksi = Transaksi::create([
                'siswa_id' => $validated['siswa_id'],
                'spp_id' => $validated['spp_id'],
                'petugas_id' => $petugasAktif->id,
                'tgl_bayar' => $validated['tgl_bayar'],
                'nominal' => $spp->nominal,
                'keterangan' => $validated['keterangan'] ?? null,
            ]);

            LogTransaksi::create([
                'transaksi_id' => $transaksi->id,
                'aksi' => 'create',
                'keterangan' => 'Pembayaran SPP dicatat.',
                'waktu' => now(),
            ]);

            return $transaksi;
        });

        return redirect()
            ->route('petugas.transaksi.index', ['siswa_id' => $transaksi->siswa_id])
            ->with('success', 'Pembayaran berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaksi $transaksi)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaksi $transaksi)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaksi $transaksi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaksi $transaksi)
    {
        //
    }
}
