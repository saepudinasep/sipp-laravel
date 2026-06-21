import AppLayout from "@/Layouts/AppLayout";
import TransaksiPembayaranForm from "@/Components/TransaksiPembayaranForm";
import { Head } from "@inertiajs/react";

interface Kelas {
    nama_kelas: string;
}

interface SiswaTerpilih {
    id: number;
    nama: string;
    nis: string;
    kelas: Kelas | null;
}

interface SppOption {
    id: number;
    jenis: string;
    bulan: number;
    bulan_label: string;
    tahun_ajaran: string;
    nominal: number;
    label: string;
}

interface StatusBulan {
    bulan_label: string;
    tahun_ajaran: string;
    lunas: boolean;
}

interface PetugasOption {
    id: number;
    nama: string;
}

interface Props {
    siswaTerpilih: SiswaTerpilih | null;
    sppBelumLunas: SppOption[];
    statusBulan: StatusBulan[];
    petugasList: PetugasOption[];
}

export default function Index({
    siswaTerpilih,
    sppBelumLunas,
    statusBulan,
    petugasList,
}: Props) {
    return (
        <AppLayout title="Entri Pembayaran">
            <Head title="Entri Pembayaran" />

            <div className="breadcrumb">
                Transaksi · <span>Entri Pembayaran</span>
            </div>
            <div className="page-header">
                <h1>Entri Pembayaran SPP</h1>
                <p>Input transaksi pembayaran SPP siswa atas nama petugas.</p>
            </div>

            <TransaksiPembayaranForm
                routePrefix="admin"
                siswaTerpilih={siswaTerpilih}
                sppBelumLunas={sppBelumLunas}
                statusBulan={statusBulan}
                petugasList={petugasList}
            />
        </AppLayout>
    );
}
