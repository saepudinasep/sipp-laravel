import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard Siswa">
            <Head title="Dashboard Siswa" />
            <div className="page-header">
                <h1>Dashboard Siswa</h1>
                <p>Pantau status pembayaran SPP kamu di sini.</p>
            </div>

            <div className="stats-grid">
                <DashboardCard
                    title="Total Dibayar"
                    value="Rp 2.500.000"
                    sub="Tahun ajaran berjalan"
                    variant="blue"
                />
                <DashboardCard
                    title="Status Pembayaran"
                    value="Lunas"
                    sub="Bulan ini"
                    variant="green"
                />
            </div>
        </AppLayout>
    );
}
