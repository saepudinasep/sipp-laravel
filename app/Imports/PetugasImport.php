<?php

namespace App\Imports;

use App\Models\Petugas;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Import data petugas dari file Excel (.xlsx/.csv) hasil isian template.
 * Setiap baris yang valid membuat akun User (role petugas) sekaligus
 * data Petugas dalam satu transaction — sama seperti
 * PetugasController::store(). Baris yang gagal divalidasi dilewati
 * tanpa menggagalkan baris lain yang valid.
 */
class PetugasImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{
    use Importable;

    /** @var array<int, array{baris:int, pesan:string}> */
    public array $gagal = [];

    public int $berhasil = 0;

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            // Baris ke-2 di Excel (baris ke-1 adalah header), karena
            // heading row sudah dikonsumsi WithHeadingRow.
            $nomorBaris = $index + 2;

            $nama = trim((string) ($row['nama_petugas'] ?? ''));
            $nip = trim((string) ($row['nip'] ?? ''));
            $jabatan = trim((string) ($row['jabatan'] ?? ''));
            $email = trim((string) ($row['email'] ?? ''));
            $password = trim((string) ($row['password'] ?? ''));

            $validator = Validator::make(
                [
                    'nama' => $nama,
                    'nip' => $nip,
                    'jabatan' => $jabatan,
                    'email' => $email,
                ],
                [
                    'nama' => ['required', 'string', 'max:100'],
                    'nip' => ['required', 'string', 'max:30', 'unique:petugas,nip'],
                    'jabatan' => ['required', 'string', 'max:50'],
                    'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                ],
            );

            if ($validator->fails()) {
                $this->gagal[] = [
                    'baris' => $nomorBaris,
                    'pesan' => implode(' ', $validator->errors()->all()),
                ];

                continue;
            }

            // Password opsional — kosongkan di Excel berarti pakai NIP
            // sebagai password awal (mudah diingat, tetap unik per orang).
            $passwordAwal = $password !== '' ? $password : $nip;

            DB::transaction(function () use ($nama, $nip, $jabatan, $email, $passwordAwal) {
                $user = User::create([
                    'email' => $email,
                    'password' => Hash::make($passwordAwal),
                    'role' => 'petugas',
                    'is_active' => true,
                ]);

                Petugas::create([
                    'nip' => $nip,
                    'nama' => $nama,
                    'jabatan' => $jabatan,
                    'user_id' => $user->id,
                ]);
            });

            $this->berhasil++;
        }
    }
}
