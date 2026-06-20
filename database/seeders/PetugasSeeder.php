<?php

namespace Database\Seeders;

use App\Models\Petugas;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PetugasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'petugas@spp.com')->first();

        Petugas::create([
            'nip' => 'PTG001',
            'nama' => 'Petugas SPP',
            'jabatan' => 'Admin Pembayaran',
            'user_id' => $user->id,
        ]);
    }
}
