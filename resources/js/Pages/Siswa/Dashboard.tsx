import DashboardCard from "@/Components/DashboardCard";
import AppLayout from "@/Layouts/AppLayout";

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard Siswa">
            <div className="grid md:grid-cols-2 gap-6">
                <DashboardCard title="Total Dibayar" value="Rp 2.500.000" />
                <DashboardCard title="Status Pembayaran" value="Lunas" />
            </div>
        </AppLayout>
    );
}
