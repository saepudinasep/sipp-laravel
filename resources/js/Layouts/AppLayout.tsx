import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import Toast from "@/Components/Toast";
import PageLoader from "@/Components/PageLoader";

export default function AppLayout({ children, title }: any) {
    const page = usePage<any>();

    const auth = page.props.auth;

    const role = auth?.user?.role ?? "";

    const menus = {
        admin: [
            { name: "Dashboard", route: "admin.dashboard" },
            { name: "Data Siswa", route: "admin.siswa.index" },
            { name: "Data Petugas", route: "admin.petugas.index" },
            { name: "Data Kelas", route: "admin.kelas.index" },
            { name: "Data SPP", route: "admin.spp.index" },
            { name: "Histori Pembayaran", route: "admin.histori.index" },
            { name: "Laporan", route: "admin.laporan.index" },
        ],

        petugas: [
            { name: "Dashboard", route: "petugas.dashboard" },
            { name: "Entri Pembayaran", route: "petugas.transaksi.index" },
            { name: "Histori Pembayaran", route: "petugas.histori.index" },
        ],

        siswa: [
            { name: "Dashboard", route: "siswa.dashboard" },
            { name: "Histori Pembayaran", route: "siswa.histori.index" },
        ],
    };

    const sidebarMenus = menus[role as keyof typeof menus] ?? [];

    return (
        <div className="app-shell">
            <Sidebar menus={sidebarMenus} />

            <div className="main-shell">
                <Header title={title} user={auth?.user} />

                <main className="main-content">{children}</main>
            </div>

            <Toast />
            <PageLoader />
        </div>
    );
}
