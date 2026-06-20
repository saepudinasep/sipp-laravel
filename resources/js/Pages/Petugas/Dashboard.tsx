import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard Petugas">
            <Head title="Dashboard Petugas" />
            <div className="page-header">
                <h1>Dashboard Petugas</h1>
                <p>Ringkasan transaksi pembayaran SPP hari ini.</p>
            </div>

            <div className="stats-grid">
                <DashboardCard
                    title="Transaksi Hari Ini"
                    value={20}
                    sub="Pembayaran tercatat"
                    variant="blue"
                />
                <DashboardCard
                    title="Total Nominal"
                    value="Rp 5.000.000"
                    sub="Terkumpul hari ini"
                    variant="green"
                />
                <DashboardCard
                    title="Siswa Membayar"
                    value={18}
                    sub="Siswa unik"
                    variant="amber"
                />
            </div>
        </AppLayout>
    );
}
