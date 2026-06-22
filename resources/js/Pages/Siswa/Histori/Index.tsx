import AppLayout from "@/Layouts/AppLayout";
import HistoriTransaksiTable from "@/Components/HistoriTransaksiTable";
import { Head } from "@inertiajs/react";

interface TransaksiRow {
    id: number;
    tgl_bayar: string;
    siswa_nama: string;
    kelas: string | null;
    spp_jenis: string;
    spp_bulan_label: string;
    nominal: number;
    petugas_nama: string;
    keterangan: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    transaksis: {
        data: TransaksiRow[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    bulanList: { value: number; label: string }[];
    filters: {
        bulan: string | null;
    };
}

export default function Index({ transaksis, bulanList, filters }: Props) {
    return (
        <AppLayout title="Histori Pembayaran">
            <Head title="Histori Pembayaran" />

            <div className="breadcrumb">
                <span>Histori Pembayaran</span>
            </div>
            <div className="page-header">
                <h1>Histori Pembayaran Saya</h1>
                <p>Riwayat pembayaran SPP yang sudah kamu lakukan.</p>
            </div>

            <HistoriTransaksiTable
                routePrefix="siswa"
                transaksis={transaksis}
                bulanList={bulanList}
                filters={filters}
            />
        </AppLayout>
    );
}
