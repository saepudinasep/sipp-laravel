<?php

namespace App\Exports;

use App\Models\Kelas;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KelasExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths, WithTitle
{
    public function collection()
    {
        return Kelas::withCount('siswa')
            ->orderBy('nama_kelas')
            ->get()
            ->map(fn($kelas, $i) => [
                $i + 1,
                $kelas->nama_kelas,
                $kelas->tingkat,
                $kelas->jurusan,
                $kelas->siswa_count,
            ]);
    }

    public function headings(): array
    {
        return ['No', 'Nama Kelas', 'Tingkat', 'Jurusan', 'Jumlah Siswa'];
    }

    public function title(): string
    {
        return 'Data Kelas';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 16,
            'C' => 10,
            'D' => 28,
            'E' => 14,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
