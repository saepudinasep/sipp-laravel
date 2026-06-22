<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanSppExport implements FromCollection, WithHeadings, WithStyles, WithTitle
{
    public function __construct(protected array $data) {}

    public function collection()
    {
        return collect($this->data['detail'])->map(fn($row) => [
            $row['no'],
            $row['nis'],
            $row['nama'],
            $row['kelas'],
            $row['jenis_spp'],
            $row['tgl_bayar'] ?? '-',
            $row['nominal'] !== null ? (float) $row['nominal'] : 0,
            $row['lunas'] ? 'LUNAS' : 'BELUM BAYAR',
        ]);
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Jenis SPP',
            'Tanggal Bayar',
            'Nominal',
            'Status',
        ];
    }

    public function title(): string
    {
        return 'Laporan SPP';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
