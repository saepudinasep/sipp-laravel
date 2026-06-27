import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import Toast from "@/Components/Toast";
import PageLoader from "@/Components/PageLoader";

export default function AppLayout({ children, title }: any) {
    const page = usePage<any>();

    const auth = page.props.auth;

    const role = auth?.user?.role ?? "";

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Tutup otomatis saat layar dibesarkan kembali ke ukuran desktop,
    // supaya sidebar tidak "nyangkut" terbuka kalau user resize window
    // setelah membukanya di mobile.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 860) setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menus = {
        admin: [
            { name: "Dashboard", route: "admin.dashboard" },
            { name: "Data Siswa", route: "admin.siswa.index" },
            { name: "Data Petugas", route: "admin.petugas.index" },
            { name: "Data Kelas", route: "admin.kelas.index" },
            { name: "Data SPP", route: "admin.spp.index" },
            { name: "Histori Pembayaran", route: "admin.histori.index" },
            { name: "Laporan", route: "admin.laporan.index" },
            { name: "Profil", route: "profile.edit" },
        ],

        petugas: [
            { name: "Dashboard", route: "petugas.dashboard" },
            { name: "Entri Pembayaran", route: "petugas.transaksi.index" },
            { name: "Histori Pembayaran", route: "petugas.histori.index" },
            { name: "Profil", route: "profile.edit" },
        ],

        siswa: [
            { name: "Dashboard", route: "siswa.dashboard" },
            { name: "Histori Pembayaran", route: "siswa.histori.index" },
            { name: "Profil", route: "profile.edit" },
        ],
    };

    const sidebarMenus = menus[role as keyof typeof menus] ?? [];

    return (
        <div className="app-shell">
            <Sidebar
                menus={sidebarMenus}
                user={auth?.user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="main-shell">
                <Header
                    title={title}
                    onMenuClick={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="main-content">{children}</main>
            </div>

            <Toast />
            <PageLoader />
        </div>
    );
}
