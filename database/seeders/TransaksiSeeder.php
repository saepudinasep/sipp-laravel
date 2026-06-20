<?php

namespace Database\Seeders;

use App\Models\Petugas;
use App\Models\Siswa;
use App\Models\Spp;
use App\Models\Transaksi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswa = Siswa::first();
        $petugas = Petugas::first();
        $spp = Spp::first();

        Transaksi::create([
            'siswa_id' => $siswa->id,
            'spp_id' => $spp->id,
            'petugas_id' => $petugas->id,
            'tgl_bayar' => now(),
            'nominal' => $spp->nominal,
            'keterangan' => 'Pembayaran pertama',
        ]);
    }
}
