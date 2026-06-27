<?php

namespace App\Imports;

use App\Models\Kelas;
use App\Models\Siswa;
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
 * Import data siswa dari file Excel (.xlsx/.csv) hasil isian template.
 * Setiap baris yang valid membuat akun User (role siswa) sekaligus
 * data Siswa dalam satu transaction — sama seperti
 * SiswaController::store(). Kolom Kelas di Excel berisi NAMA kelas
 * (bukan ID), jadi di-resolve dulu ke kelas_id sebelum disimpan.
 */
class SiswaImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{
    use Importable;

    /** @var array<int, array{baris:int, pesan:string}> */
    public array $gagal = [];

    public int $berhasil = 0;

    /** Cache nama kelas -> id, supaya tidak query berulang per baris. */
    protected ?Collection $kelasMap = null;

    public function collection(Collection $rows)
    {
        $this->kelasMap = Kelas::pluck('id', 'nama_kelas');

        foreach ($rows as $index => $row) {
            // Baris ke-2 di Excel (baris ke-1 adalah header), karena
            // heading row sudah dikonsumsi WithHeadingRow.
            $nomorBaris = $index + 2;

            $nama = trim((string) ($row['nama_siswa'] ?? ''));
            $nis = trim((string) ($row['nis'] ?? ''));
            $namaKelas = trim((string) ($row['kelas'] ?? ''));
            $telp = trim((string) ($row['no_telepon'] ?? ''));
            $alamat = trim((string) ($row['alamat'] ?? ''));
            $email = trim((string) ($row['email'] ?? ''));
            $password = trim((string) ($row['password'] ?? ''));

            $kelasId = $this->kelasMap->get($namaKelas);

            $validator = Validator::make(
                [
                    'nama' => $nama,
                    'nis' => $nis,
                    'kelas_id' => $kelasId,
                    'email' => $email,
                ],
                [
                    'nama' => ['required', 'string', 'max:100'],
                    'nis' => ['required', 'string', 'max:20', 'unique:siswas,nis'],
                    'kelas_id' => ['required', 'integer'],
                    'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                ],
                [
                    'kelas_id.required' => "Nama kelas '{$namaKelas}' tidak ditemukan di sistem.",
                ],
            );

            if ($validator->fails()) {
                $this->gagal[] = [
                    'baris' => $nomorBaris,
                    'pesan' => implode(' ', $validator->errors()->all()),
                ];

                continue;
            }

            // Password opsional — kosongkan di Excel berarti pakai NIS
            // sebagai password awal (mudah diingat, tetap unik per siswa).
            $passwordAwal = $password !== '' ? $password : $nis;

            DB::transaction(function () use ($nama, $nis, $kelasId, $telp, $alamat, $email, $passwordAwal) {
                $user = User::create([
                    'email' => $email,
                    'password' => Hash::make($passwordAwal),
                    'role' => 'siswa',
                    'is_active' => true,
                ]);

                Siswa::create([
                    'nis' => $nis,
                    'nama' => $nama,
                    'kelas_id' => $kelasId,
                    'telp' => $telp !== '' ? $telp : null,
                    'alamat' => $alamat !== '' ? $alamat : null,
                    'user_id' => $user->id,
                ]);
            });

            $this->berhasil++;
        }
    }
}
