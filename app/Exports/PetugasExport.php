<?php

namespace App\Exports;

use App\Models\Petugas;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export seluruh data petugas ke file Excel (.xlsx), termasuk email
 * akun login. Password TIDAK ikut diexport (sudah di-hash, tidak bisa
 * dan tidak boleh dibalik ke teks asli).
 */
class PetugasExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    public function collection()
    {
        return Petugas::with('user')
            ->orderBy('nama')
            ->get()
            ->map(fn($petugas, $i) => [
                $i + 1,
                $petugas->nama,
                $petugas->nip,
                $petugas->jabatan,
                $petugas->user->email ?? '-',
                $petugas->user?->is_active ? 'Aktif' : 'Nonaktif',
            ]);
    }

    public function headings(): array
    {
        return ['No', 'Nama Petugas', 'NIP', 'Jabatan', 'Email', 'Status'];
    }

    public function title(): string
    {
        return 'Data Petugas';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 24,
            'C' => 18,
            'D' => 20,
            'E' => 26,
            'F' => 12,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
