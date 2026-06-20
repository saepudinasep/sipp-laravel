import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard Petugas">
            <div className="grid md:grid-cols-3 gap-6">
                <DashboardCard title="Transaksi Hari Ini" value={20} />
                <DashboardCard title="Total Nominal" value="Rp 5.000.000" />
                <DashboardCard title="Siswa Membayar" value={18} />
            </div>
        </AppLayout>
    );
}
