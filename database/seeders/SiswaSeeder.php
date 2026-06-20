<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'siswa@spp.com')->first();

        $kelas = Kelas::first();

        Siswa::create([
            'nis' => '20260001',
            'nama' => 'Siswa Demo',
            'kelas_id' => $kelas->id,
            'alamat' => 'Jakarta',
            'telp' => '081234567890',
            'user_id' => $user->id,
        ]);
    }
}
