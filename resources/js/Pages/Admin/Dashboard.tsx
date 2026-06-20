import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard() {
    const stats = {
        siswa: 125,
        petugas: 5,
        kelas: 8,
        transaksi: 500,
    };

    return (
        <AppLayout title="Dashboard Admin">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashboardCard title="Total Siswa" value={stats.siswa} />
                <DashboardCard title="Total Petugas" value={stats.petugas} />
                <DashboardCard title="Total Kelas" value={stats.kelas} />
                <DashboardCard
                    title="Total Pembayaran"
                    value={stats.transaksi}
                />
            </div>
        </AppLayout>
    );
}
