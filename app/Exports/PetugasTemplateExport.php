<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Template kosong untuk import data petugas. Berisi header + satu baris
 * contoh. Kolom Password sengaja OPSIONAL — jika dikosongkan, sistem
 * otomatis memakai NIP sebagai password awal (mudah diingat petugas,
 * tetap unik per orang). Petugas disarankan mengganti password setelah
 * login pertama kali.
 */
class PetugasTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithTitle, WithEvents
{
    use Exportable;

    public function array(): array
    {
        return [
            ['Ibu Wati', '198001012010012001', 'Staff Keuangan', 'wati@sekolah.id', ''],
        ];
    }

    public function headings(): array
    {
        return ['Nama Petugas', 'NIP', 'Jabatan', 'Email', 'Password'];
    }

    public function title(): string
    {
        return 'Template Petugas';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 22,
            'B' => 22,
            'C' => 20,
            'D' => 26,
            'E' => 20,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            2 => ['font' => ['italic' => true, 'color' => ['rgb' => '9AA3B8']]],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $sheet->setCellValue('G1', 'Petunjuk:');
                $sheet->setCellValue('G2', '1. Hapus baris contoh sebelum upload data asli.');
                $sheet->setCellValue('G3', '2. NIP dan Email harus unik, tidak boleh duplikat.');
                $sheet->setCellValue('G4', '3. Kolom Password BOLEH dikosongkan — jika kosong,');
                $sheet->setCellValue('G5', '   sistem otomatis memakai NIP sebagai password awal.');
                $sheet->setCellValue('G6', '4. Sarankan petugas mengganti password setelah login.');
                $sheet->getStyle('G1')->getFont()->setBold(true);
                $sheet->getColumnDimension('G')->setWidth(50);
            },
        ];
    }
}
