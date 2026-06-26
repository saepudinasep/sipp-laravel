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
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Template kosong untuk import data kelas. Berisi header + satu baris
 * contoh, plus dropdown validasi untuk kolom Tingkat (X/XI/XII) supaya
 * user tidak salah ketik saat mengisi template secara manual.
 *
 * Kolom sengaja TIDAK menyertakan "Jumlah Siswa" — itu nilai hasil
 * hitung otomatis dari relasi siswa, bukan input yang bisa diisi user.
 */
class KelasTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithTitle, WithEvents
{
    use Exportable;

    public function array(): array
    {
        return [
            ['X RPL 1', 'X', 'Rekayasa Perangkat Lunak'],
            ['XI TKJ 2', 'XI', 'Teknik Komputer dan Jaringan'],
        ];
    }

    public function headings(): array
    {
        return ['Nama Kelas', 'Tingkat', 'Jurusan'];
    }

    public function title(): string
    {
        return 'Template Kelas';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 18,
            'B' => 10,
            'C' => 32,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
            2 => ['font' => ['italic' => true, 'color' => ['rgb' => '9AA3B8']]],
            3 => ['font' => ['italic' => true, 'color' => ['rgb' => '9AA3B8']]],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Dropdown validasi untuk kolom Tingkat (B), berlaku untuk
                // 200 baris ke depan agar cukup untuk import data banyak.
                $validation = $sheet->getCell('B2')->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setAllowBlank(false);
                $validation->setShowDropDown(true);
                $validation->setShowErrorMessage(true);
                $validation->setErrorTitle('Input tidak valid');
                $validation->setError('Pilih salah satu: X, XI, atau XII.');
                $validation->setFormula1('"X,XI,XII"');

                for ($row = 2; $row <= 200; $row++) {
                    $sheet->getCell("B{$row}")
                        ->setDataValidation(clone $validation);
                }

                // Catatan penjelasan di luar area tabel.
                $sheet->setCellValue('E1', 'Petunjuk:');
                $sheet->setCellValue('E2', '1. Hapus baris contoh sebelum upload data asli.');
                $sheet->setCellValue('E3', '2. Nama Kelas harus unik, tidak boleh duplikat.');
                $sheet->setCellValue('E4', '3. Tingkat hanya boleh: X, XI, atau XII.');
                $sheet->getStyle('E1')->getFont()->setBold(true);
                $sheet->getColumnDimension('E')->setWidth(45);
            },
        ];
    }
}
