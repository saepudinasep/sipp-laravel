<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Laporan Pembayaran SPP</title>
    <style>
        * {
            font-family: 'Helvetica', Arial, sans-serif;
        }

        body {
            font-size: 11px;
            color: #0f1f3d;
        }

        .header {
            margin-bottom: 16px;
        }

        .header h1 {
            font-size: 16px;
            margin: 0 0 4px;
        }

        .header p {
            font-size: 11px;
            color: #4a5270;
            margin: 0;
        }

        .meta {
            text-align: right;
            font-size: 10px;
            color: #5c6580;
            margin-bottom: 16px;
        }

        .summary {
            width: 100%;
            margin-bottom: 16px;
            border-collapse: collapse;
        }

        .summary td {
            width: 33.33%;
            text-align: center;
            border: 1px solid #d6dbe8;
            padding: 10px;
        }

        .summary .val {
            font-size: 18px;
            font-weight: bold;
            display: block;
        }

        .summary .label {
            font-size: 10px;
            color: #5c6580;
        }

        table.detail {
            width: 100%;
            border-collapse: collapse;
        }

        table.detail th,
        table.detail td {
            border: 1px solid #d6dbe8;
            padding: 5px 7px;
            font-size: 10px;
            text-align: left;
        }

        table.detail th {
            background: #f7f8fa;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
        }

        .badge-lunas {
            background: #d1fae5;
            color: #059669;
        }

        .badge-belum {
            background: #fee2e2;
            color: #dc2626;
        }

        .footer-total {
            margin-top: 10px;
            text-align: right;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Rekapitulasi Pembayaran SPP</h1>
        <p>Periode: {{ $bulanLabel }} {{ $filters['tahun_ajaran'] }} &middot; {{ $kelasLabel }}</p>
    </div>

    <div class="meta">
        Dicetak oleh: {{ $dicetakOleh }}<br>
        Tanggal: {{ now()->translatedFormat('d F Y') }}
    </div>

    <table class="summary">
        <tr>
            <td>
                <span class="val">{{ $summary['total_siswa'] }}</span>
                <span class="label">Total Siswa</span>
            </td>
            <td>
                <span class="val">{{ $summary['sudah_bayar'] }}</span>
                <span class="label">Sudah Bayar</span>
            </td>
            <td>
                <span class="val">{{ $summary['belum_bayar'] }}</span>
                <span class="label">Belum Bayar</span>
            </td>
        </tr>
    </table>

    <table class="detail">
        <thead>
            <tr>
                <th>No</th>
                <th>NIS</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Jenis SPP</th>
                <th>Tgl Bayar</th>
                <th class="text-right">Nominal</th>
                <th class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($detail as $row)
                <tr>
                    <td>{{ $row['no'] }}</td>
                    <td>{{ $row['nis'] }}</td>
                    <td>{{ $row['nama'] }}</td>
                    <td>{{ $row['kelas'] }}</td>
                    <td>{{ $row['jenis_spp'] }}</td>
                    <td>{{ $row['tgl_bayar'] ?? '-' }}</td>
                    <td class="text-right">
                        {{ $row['nominal'] !== null ? 'Rp ' . number_format($row['nominal'], 0, ',', '.') : '-' }}
                    </td>
                    <td class="text-center">
                        @if ($row['lunas'])
                            <span class="badge badge-lunas">LUNAS</span>
                        @else
                            <span class="badge badge-belum">BELUM</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer-total">
        Total terkumpul bulan ini: Rp {{ number_format($totalTerkumpul, 0, ',', '.') }}
    </div>
</body>

</html>
