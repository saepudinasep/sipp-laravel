<?php

namespace App\Imports;

use App\Models\Kelas;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

/**
 * Import data kelas dari file Excel (.xlsx/.csv) hasil isian template.
 * Setiap baris divalidasi secara independen — baris yang valid tetap
 * disimpan walau ada baris lain yang gagal, supaya satu kesalahan kecil
 * tidak menggagalkan seluruh proses upload.
 */
class KelasImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
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

            $namaKelas = trim((string) ($row['nama_kelas'] ?? ''));
            $tingkat = trim((string) ($row['tingkat'] ?? ''));
            $jurusan = trim((string) ($row['jurusan'] ?? ''));

            $validator = Validator::make(
                [
                    'nama_kelas' => $namaKelas,
                    'tingkat' => $tingkat,
                    'jurusan' => $jurusan,
                ],
                [
                    'nama_kelas' => ['required', 'string', 'max:20', 'unique:kelas,nama_kelas'],
                    'tingkat' => ['required', 'in:X,XI,XII'],
                    'jurusan' => ['required', 'string', 'max:50'],
                ],
            );

            if ($validator->fails()) {
                $this->gagal[] = [
                    'baris' => $nomorBaris,
                    'pesan' => implode(' ', $validator->errors()->all()),
                ];

                continue;
            }

            Kelas::create([
                'nama_kelas' => $namaKelas,
                'tingkat' => $tingkat,
                'jurusan' => $jurusan,
            ]);

            $this->berhasil++;
        }
    }
}
