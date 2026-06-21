<?php

namespace App\Http\Controllers;

use App\Models\LogTransaksi;
use App\Models\Petugas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\Transaksi;
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
     */
    public function index(Request $request)
    {
        $role = Auth::user()->role;
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

        $page = $role === 'admin' ? 'Admin/Transaksi/Index' : 'Petugas/Transaksi/Index';

        $props = [
            'siswaTerpilih' => $siswaTerpilih,
            'sppBelumLunas' => $sppBelumLunas,
            'statusBulan' => $statusBulan,
        ];

        if ($role === 'admin') {
            $props['petugasList'] = Petugas::orderBy('nama')->get(['id', 'nama']);
        } else {
            $props['petugasNama'] = $petugasAktif->nama ?? Auth::user()->email;
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
     * Simpan transaksi pembayaran baru.
     * Petugas penerima ditentukan dari data petugas milik user yang login
     * (jika role petugas), atau dari pilihan dropdown (jika role admin).
     */
    public function store(Request $request)
    {
        $role = Auth::user()->role;

        $rules = [
            'siswa_id' => ['required', 'exists:siswas,id'],
            'spp_id' => ['required', 'exists:spps,id'],
            'tgl_bayar' => ['required', 'date'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ];

        if ($role === 'admin') {
            $rules['petugas_id'] = ['required', 'exists:petugas,id'];
        }

        $validated = $request->validate($rules);

        if ($role === 'admin') {
            $petugasId = $validated['petugas_id'];
        } else {
            $petugasAktif = Auth::user()->petugas;

            if (!$petugasAktif) {
                return back()->with('error', 'Akun Anda tidak terhubung ke data petugas.');
            }

            $petugasId = $petugasAktif->id;
        }

        $spp = Spp::findOrFail($validated['spp_id']);

        $sudahLunas = Transaksi::where('siswa_id', $validated['siswa_id'])
            ->where('spp_id', $validated['spp_id'])
            ->exists();

        if ($sudahLunas) {
            return back()->with('error', 'SPP untuk bulan tersebut sudah dibayar sebelumnya.');
        }

        $transaksi = DB::transaction(function () use ($validated, $petugasId, $spp) {
            $transaksi = Transaksi::create([
                'siswa_id' => $validated['siswa_id'],
                'spp_id' => $validated['spp_id'],
                'petugas_id' => $petugasId,
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

        $routeName = $role === 'admin' ? 'admin.transaksi.index' : 'petugas.transaksi.index';

        return redirect()
            ->route($routeName, ['siswa_id' => $transaksi->siswa_id])
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
