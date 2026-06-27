<?php

namespace App\Exports;

use App\Models\Kelas;
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
 * Template kosong untuk import data siswa. Kolom Kelas memakai dropdown
 * validasi berisi nama kelas yang SUDAH ADA di database (dinamis, bukan
 * daftar tetap) — supaya user tidak salah ketik nama kelas saat mengisi
 * template secara manual.
 *
 * Kolom Password OPSIONAL — jika dikosongkan, sistem otomatis memakai
 * NIS sebagai password awal (sama pola dengan Petugas yang memakai NIP).
 */
class SiswaTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithTitle, WithEvents
{
    use Exportable;

    public function array(): array
    {
        return [
            ['Ahmad Fauzi', '20260001', 'X RPL 1', '0812-3456-7890', 'Jl. Merdeka No. 1', 'ahmad.fauzi@siswa.id', ''],
        ];
    }

    public function headings(): array
    {
        return ['Nama Siswa', 'NIS', 'Kelas', 'No. Telepon', 'Alamat', 'Email', 'Password'];
    }

    public function title(): string
    {
        return 'Template Siswa';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 22,
            'B' => 14,
            'C' => 14,
            'D' => 18,
            'E' => 28,
            'F' => 26,
            'G' => 16,
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

                $namaKelasList = Kelas::orderBy('nama_kelas')->pluck('nama_kelas');

                // Dropdown validasi untuk kolom Kelas (C), berlaku untuk
                // 300 baris ke depan agar cukup untuk import data banyak.
                if ($namaKelasList->isNotEmpty()) {
                    $formula = '"' . $namaKelasList->implode(',') . '"';

                    $validation = $sheet->getCell('C2')->getDataValidation();
                    $validation->setType(DataValidation::TYPE_LIST);
                    $validation->setErrorStyle(DataValidation::STYLE_STOP);
                    $validation->setAllowBlank(false);
                    $validation->setShowDropDown(true);
                    $validation->setShowErrorMessage(true);
                    $validation->setErrorTitle('Input tidak valid');
                    $validation->setError('Pilih salah satu nama kelas yang tersedia di sistem.');
                    $validation->setFormula1($formula);

                    for ($row = 2; $row <= 300; $row++) {
                        $sheet->getCell("C{$row}")
                            ->setDataValidation(clone $validation);
                    }
                }

                $sheet->setCellValue('I1', 'Petunjuk:');
                $sheet->setCellValue('I2', '1. Hapus baris contoh sebelum upload data asli.');
                $sheet->setCellValue('I3', '2. NIS dan Email harus unik, tidak boleh duplikat.');
                $sheet->setCellValue('I4', '3. Nama Kelas harus sama persis dengan yang ada di');
                $sheet->setCellValue('I5', '   sistem — klik sel kolom C untuk lihat dropdown.');
                $sheet->setCellValue('I6', '4. Password boleh dikosongkan — jika kosong, sistem');
                $sheet->setCellValue('I7', '   otomatis memakai NIS sebagai password awal.');
                $sheet->setCellValue('I8', '5. No. Telepon dan Alamat boleh dikosongkan.');
                $sheet->getStyle('I1')->getFont()->setBold(true);
                $sheet->getColumnDimension('I')->setWidth(50);
            },
        ];
    }
}
