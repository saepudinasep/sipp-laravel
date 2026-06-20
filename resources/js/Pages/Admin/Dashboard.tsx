import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const stats = {
        siswa: 125,
        petugas: 5,
        kelas: 8,
        transaksi: 500,
    };

    return (
        <AppLayout title="Dashboard Admin">
            <Head title="Dashboard Admin" />
            <div className="page-header">
                <h1>Dashboard Admin</h1>
                <p>
                    Selamat datang! Berikut ringkasan aktivitas pembayaran SPP.
                </p>
            </div>

            <div className="stats-grid">
                <DashboardCard
                    title="Total Siswa"
                    value={stats.siswa}
                    sub={`${stats.kelas} kelas aktif`}
                    variant="blue"
                />
                <DashboardCard
                    title="Total Petugas"
                    value={stats.petugas}
                    sub="Petugas aktif"
                    variant="green"
                />
                <DashboardCard
                    title="Total Kelas"
                    value={stats.kelas}
                    sub="Kelas terdaftar"
                    variant="amber"
                />
                <DashboardCard
                    title="Total Pembayaran"
                    value={stats.transaksi}
                    sub="Transaksi tercatat"
                    variant="red"
                />
            </div>
        </AppLayout>
    );
}
