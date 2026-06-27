<?php

namespace App\Exports;

use App\Models\Siswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export seluruh data siswa ke file Excel (.xlsx), termasuk email akun
 * login. Password TIDAK ikut diexport (sudah di-hash, tidak bisa dan
 * tidak boleh dibalik ke teks asli).
 */
class SiswaExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    public function collection()
    {
        return Siswa::with(['kelas', 'user'])
            ->orderBy('nama')
            ->get()
            ->map(fn($siswa, $i) => [
                $i + 1,
                $siswa->nama,
                $siswa->nis,
                $siswa->kelas->nama_kelas ?? '-',
                $siswa->telp ?? '-',
                $siswa->alamat ?? '-',
                $siswa->user->email ?? '-',
                $siswa->user?->is_active ? 'Aktif' : 'Nonaktif',
            ]);
    }

    public function headings(): array
    {
        return ['No', 'Nama Siswa', 'NIS', 'Kelas', 'No. Telepon', 'Alamat', 'Email', 'Status'];
    }

    public function title(): string
    {
        return 'Data Siswa';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 24,
            'C' => 14,
            'D' => 14,
            'E' => 18,
            'F' => 30,
            'G' => 26,
            'H' => 12,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
