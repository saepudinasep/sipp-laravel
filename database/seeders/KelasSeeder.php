<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kelas::insert([
            [
                'nama_kelas' => 'X RPL 1',
                'tingkat' => 'X',
                'jurusan' => 'Rekayasa Perangkat Lunak',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_kelas' => 'XI RPL 1',
                'tingkat' => 'XI',
                'jurusan' => 'Rekayasa Perangkat Lunak',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_kelas' => 'XII RPL 1',
                'tingkat' => 'XII',
                'jurusan' => 'Rekayasa Perangkat Lunak',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
