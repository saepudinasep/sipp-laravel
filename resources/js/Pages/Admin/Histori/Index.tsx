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
    kelasList: { id: number; nama_kelas: string }[];
    bulanList: { value: number; label: string }[];
    filters: {
        search: string | null;
        bulan: string | null;
        kelas_id: string | null;
    };
}

export default function Index({
    transaksis,
    kelasList,
    bulanList,
    filters,
}: Props) {
    return (
        <AppLayout title="Histori Pembayaran">
            <Head title="Histori Pembayaran" />

            <div className="breadcrumb">
                Transaksi · <span>Histori Pembayaran</span>
            </div>
            <div className="page-header">
                <h1>Histori Pembayaran</h1>
                <p>Riwayat seluruh transaksi pembayaran SPP.</p>
            </div>

            <HistoriTransaksiTable
                routePrefix="admin"
                transaksis={transaksis}
                kelasList={kelasList}
                bulanList={bulanList}
                filters={filters}
            />
        </AppLayout>
    );
}
