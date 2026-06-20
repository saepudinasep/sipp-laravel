// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head } from "@inertiajs/react";

// export default function Dashboard() {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             You're logged in!
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import React, { useState, useEffect } from "react";
import { Link, usePage, Head } from "@inertiajs/react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StatCard {
    label: string;
    value: string;
    sub: string;
    trend: string;
    trendUp: boolean;
    color: "blue" | "green" | "amber" | "red";
    icon: React.ReactNode;
}

interface TimelineItem {
    color: string;
    name: string;
    kelas: string;
    desc: string;
    time: string;
    amount?: string;
}

interface SiswaNunggak {
    no: number;
    nama: string;
    nis: string;
    kelas: string;
    bulan: number;
    total: string;
}

interface DashboardProps {
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
}

// ─────────────────────────────────────────────
// Icon SVG helpers
// ─────────────────────────────────────────────
const IconDashboard = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 8h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10 0h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm0-18h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v4a1 1 0 001 1z" />
    </svg>
);
const IconCard = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
);
const IconHistory = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
);
const IconReport = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
    </svg>
);
const IconSiswa = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
);
const IconPetugas = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
);
const IconKelas = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
);
const IconSPP = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18 }}
    >
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
);

// ─────────────────────────────────────────────
// Data statis (nanti diganti dari API Laravel)
// ─────────────────────────────────────────────
const CHART_DATA = [
    { month: "Agu", pct: 55 },
    { month: "Sep", pct: 70 },
    { month: "Okt", pct: 62 },
    { month: "Nov", pct: 80 },
    { month: "Des", pct: 73 },
    { month: "Jan", pct: 90, active: true },
];

const TIMELINE: TimelineItem[] = [
    {
        color: "#10B981",
        name: "Ahmad Fauzi",
        kelas: "XI RPL 1",
        desc: "SPP Januari 2020",
        time: "09:42",
        amount: "+ Rp 150.000",
    },
    {
        color: "#10B981",
        name: "Siti Rahayu",
        kelas: "X RPL 2",
        desc: "SPP Januari 2020",
        time: "09:15",
        amount: "+ Rp 150.000",
    },
    {
        color: "#10B981",
        name: "Budi Santoso",
        kelas: "XII RPL 1",
        desc: "SPP Desember 2019",
        time: "08:50",
        amount: "+ Rp 150.000",
    },
    {
        color: "#F59E0B",
        name: "Dewi Lestari",
        kelas: "XI RPL 2",
        desc: "Login",
        time: "08:31",
    },
];

const NUNGGAK: SiswaNunggak[] = [
    {
        no: 1,
        nama: "Rudi Hermawan",
        nis: "2019005",
        kelas: "XI RPL 2",
        bulan: 3,
        total: "Rp 450.000",
    },
    {
        no: 2,
        nama: "Lisa Permata",
        nis: "2019012",
        kelas: "X RPL 1",
        bulan: 2,
        total: "Rp 300.000",
    },
    {
        no: 3,
        nama: "Andi Prasetyo",
        nis: "2019034",
        kelas: "XII RPL 2",
        bulan: 4,
        total: "Rp 600.000",
    },
    {
        no: 4,
        nama: "Mega Wulandari",
        nis: "2019021",
        kelas: "X RPL 2",
        bulan: 1,
        total: "Rp 150.000",
    },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Sidebar navigasi admin */
const Sidebar: React.FC<{
    activePage: string;
    onNavigate: (p: string) => void;
    onLogout: () => void;
}> = ({ activePage, onNavigate, onLogout }) => {
    const navItem = (
        page: string,
        label: string,
        icon: React.ReactNode,
        badge?: number,
    ) => (
        <div
            key={page}
            onClick={() => onNavigate(page)}
            style={{
                ...s.navItem,
                ...(activePage === page ? s.navItemActive : {}),
            }}
        >
            <span
                style={{
                    opacity: activePage === page ? 1 : 0.7,
                    display: "flex",
                }}
            >
                {icon}
            </span>
            {label}
            {badge ? <span style={s.navBadge}>{badge}</span> : null}
        </div>
    );

    return (
        <aside style={s.sidebar}>
            {/* Logo */}
            <div style={s.sidebarLogo}>
                <div style={s.sidebarLogoIcon}>
                    <svg
                        viewBox="0 0 24 24"
                        style={{ width: 18, height: 18, fill: "#fff" }}
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                    </svg>
                </div>
                <div>
                    <div style={s.sidebarLogoText}>SiPP</div>
                    <div style={s.sidebarLogoSub}>SMK RPL</div>
                </div>
            </div>

            {/* Nav utama */}
            <div style={s.sidebarSection}>
                <div style={s.sectionLabel}>Utama</div>
                {navItem("dashboard", "Dashboard", <IconDashboard />)}
                {navItem("entri-bayar", "Entri Pembayaran", <IconCard />, 5)}
                {navItem("histori", "Histori Pembayaran", <IconHistory />)}
                {navItem("laporan", "Laporan", <IconReport />)}
            </div>

            {/* Master data */}
            <div style={s.sidebarSection}>
                <div style={s.sectionLabel}>Master Data</div>
                {navItem("data-siswa", "Data Siswa", <IconSiswa />)}
                {navItem("data-petugas", "Data Petugas", <IconPetugas />)}
                {navItem("data-kelas", "Data Kelas", <IconKelas />)}
                {navItem("data-spp", "Data SPP", <IconSPP />)}
            </div>

            {/* Footer user */}
            <div style={s.sidebarFooter}>
                <div style={s.userCard}>
                    <div style={s.userAvatar}>AD</div>
                    <div>
                        <div style={s.userName}>Admin Sekolah</div>
                        <div style={s.userRole}>Administrator</div>
                    </div>
                </div>
                <button style={s.logoutBtn} onClick={onLogout}>
                    ← Keluar
                </button>
            </div>
        </aside>
    );
};

/** Kartu statistik */
const StatCardEl: React.FC<StatCard> = ({
    label,
    value,
    sub,
    trend,
    trendUp,
    color,
    icon,
}) => {
    const accentColor = {
        blue: "#1E6FE8",
        green: "#10B981",
        amber: "#F59E0B",
        red: "#EF4444",
    }[color];
    const bgIcon = {
        blue: "rgba(30,111,232,.1)",
        green: "rgba(16,185,129,.1)",
        amber: "rgba(245,158,11,.1)",
        red: "rgba(239,68,68,.1)",
    }[color];

    return (
        <div
            style={
                {
                    ...s.statCard,
                    "--accent": accentColor,
                } as React.CSSProperties
            }
        >
            {/* accent bar */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: accentColor,
                    borderRadius: "16px 16px 0 0",
                }}
            />
            <div style={s.statCardTop}>
                <div style={s.statCardLabel}>{label}</div>
                <div style={{ ...s.statCardIcon, background: bgIcon }}>
                    <svg
                        viewBox="0 0 24 24"
                        style={{ width: 20, height: 20, fill: accentColor }}
                    >
                        {icon}
                    </svg>
                </div>
            </div>
            <div>
                <div style={s.statCardVal}>{value}</div>
                <div style={s.statCardSub}>{sub}</div>
            </div>
            <div>
                <span
                    style={{
                        ...s.trend,
                        ...(trendUp ? s.trendUp : s.trendDown),
                    }}
                >
                    {trendUp ? "↑" : "↓"} {trend}
                </span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const Dashboard: React.FC<DashboardProps> = ({
    onNavigate = () => {},
    onLogout = () => {},
}) => {
    const user = usePage().props.auth.user;
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    // Contoh: fetch data dari Laravel API
    // useEffect(() => {
    //   fetch('/api/dashboard/stats', {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('sipp_token')}` }
    //   })
    //     .then(r => r.json())
    //     .then(data => setStats(data));
    // }, []);

    const stats: StatCard[] = [
        {
            label: "Total Siswa",
            value: "248",
            sub: "6 kelas aktif",
            trend: "+12 siswa baru",
            trendUp: true,
            color: "blue",
            icon: (
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            ),
        },
        {
            label: "Sudah Bayar",
            value: "189",
            sub: "Bulan ini · 76.2%",
            trend: "Meningkat 8%",
            trendUp: true,
            color: "green",
            icon: (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            ),
        },
        {
            label: "Belum Bayar",
            value: "59",
            sub: "Bulan ini · 23.8%",
            trend: "Perlu tindak lanjut",
            trendUp: false,
            color: "amber",
            icon: (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            ),
        },
        {
            label: "Total Pemasukan",
            value: "Rp 28,35jt",
            sub: "Bulan Januari 2020",
            trend: "+Rp 1,8jt vs bulan lalu",
            trendUp: true,
            color: "blue",
            icon: (
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            ),
        },
    ];

    return (
        <div style={s.shell}>
            <Head title="Dashboard" />
            <Sidebar
                activePage="dashboard"
                onNavigate={onNavigate}
                onLogout={onLogout}
            />

            <main style={s.main}>
                {/* Breadcrumb */}
                <div style={s.breadcrumb}>
                    SiPP ·{" "}
                    <span style={{ color: "#1E6FE8", fontWeight: 500 }}>
                        Dashboard
                    </span>
                </div>

                {/* Page header */}
                <div style={s.pageHeader}>
                    <h1 style={s.pageTitle}>Dashboard Admin</h1>
                    <p style={s.pageDesc}>
                        Selamat datang {user.name}! Berikut ringkasan aktivitas
                        pembayaran SPP hari ini.
                    </p>
                </div>

                {/* ── Stat Cards ── */}
                <div style={s.statsGrid}>
                    {stats.map((c) => (
                        <StatCardEl key={c.label} {...c} />
                    ))}
                </div>

                {/* ── Chart + Timeline ── */}
                <div style={s.twoCol}>
                    {/* Bar chart tren pembayaran */}
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <div>
                                <div style={s.cardTitle}>Tren Pembayaran</div>
                                <div style={s.cardSubtitle}>
                                    6 bulan terakhir
                                </div>
                            </div>
                        </div>
                        <div style={s.chartArea}>
                            {CHART_DATA.map((d, i) => (
                                <div key={d.month} style={s.chartBarWrap}>
                                    <div
                                        style={{
                                            ...s.chartBar,
                                            height: `${d.pct}%`,
                                            opacity:
                                                hoveredBar === i
                                                    ? 0.85
                                                    : d.active
                                                      ? 1
                                                      : 0.35,
                                            background: d.active
                                                ? "#1E6FE8"
                                                : "#1E6FE8",
                                        }}
                                        title={`${d.month}: ${d.pct}%`}
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={s.chartLabels}>
                            {CHART_DATA.map((d) => (
                                <span
                                    key={d.month}
                                    style={
                                        d.active
                                            ? s.chartLabelActive
                                            : s.chartLabel
                                    }
                                >
                                    {d.month}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Aktivitas terkini */}
                    <div style={s.card}>
                        <div style={s.cardHeader}>
                            <div style={s.cardTitle}>Aktivitas Terkini</div>
                        </div>
                        <div style={s.timeline}>
                            {TIMELINE.map((t, i) => (
                                <div key={i} style={s.tlItem}>
                                    <div
                                        style={{
                                            ...s.tlDot,
                                            background: t.color,
                                        }}
                                    />
                                    <div>
                                        <div style={s.tlLabel}>
                                            {t.name} — {t.kelas}
                                        </div>
                                        <div style={s.tlSub}>
                                            {t.desc} · {t.time}
                                        </div>
                                        {t.amount && (
                                            <div style={s.tlAmount}>
                                                {t.amount}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tabel siswa nunggak ── */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <div>
                            <div style={s.cardTitle}>Siswa Belum Bayar</div>
                            <div style={s.cardSubtitle}>Bulan Januari 2020</div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                style={s.btnOutline}
                                onClick={() => onNavigate("histori")}
                            >
                                Lihat Semua
                            </button>
                            <button
                                style={s.btnPrimary}
                                onClick={() => onNavigate("entri-bayar")}
                            >
                                + Entri Pembayaran
                            </button>
                        </div>
                    </div>
                    <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "No",
                                    "Nama Siswa",
                                    "NIS",
                                    "Kelas",
                                    "Bulan Nunggak",
                                    "Total",
                                    "Aksi",
                                ].map((h) => (
                                    <th key={h} style={s.th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {NUNGGAK.map((row) => (
                                <tr key={row.nis} style={s.tr}>
                                    <td style={s.td}>{row.no}</td>
                                    <td
                                        style={{
                                            ...s.td,
                                            fontWeight: 600,
                                            color: "#0F1F3D",
                                        }}
                                    >
                                        {row.nama}
                                    </td>
                                    <td
                                        style={{
                                            ...s.td,
                                            fontFamily: "DM Mono, monospace",
                                            fontSize: 12,
                                        }}
                                    >
                                        {row.nis}
                                    </td>
                                    <td style={s.td}>{row.kelas}</td>
                                    <td style={s.td}>
                                        <span
                                            style={{
                                                ...s.badge,
                                                background:
                                                    "rgba(245,158,11,.1)",
                                                color: "#D97706",
                                            }}
                                        >
                                            {row.bulan} bulan
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            ...s.td,
                                            fontWeight: 700,
                                            color: "#EF4444",
                                        }}
                                    >
                                        {row.total}
                                    </td>
                                    <td style={s.td}>
                                        <button
                                            style={s.btnSm}
                                            onClick={() =>
                                                onNavigate("entri-bayar")
                                            }
                                        >
                                            Bayar Sekarang
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    shell: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#F7F8FA",
    },

    /* ── sidebar ── */
    sidebar: {
        width: 224,
        flexShrink: 0,
        background: "#0F1F3D",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
    },
    sidebarLogo: {
        padding: "20px 20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid rgba(255,255,255,.07)",
        marginBottom: 8,
    },
    sidebarLogoIcon: {
        width: 36,
        height: 36,
        background: "#1E6FE8",
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    sidebarLogoText: {
        fontSize: 15,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-.2px",
    },
    sidebarLogoSub: {
        fontSize: 10,
        fontWeight: 400,
        color: "rgba(255,255,255,.35)",
    },
    sidebarSection: { padding: "6px 12px", marginBottom: 4 },
    sectionLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: "rgba(255,255,255,.3)",
        letterSpacing: 1,
        textTransform: "uppercase",
        padding: "4px 8px",
        marginBottom: 4,
    },
    navItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        borderRadius: 8,
        color: "rgba(255,255,255,.5)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all .15s",
        marginBottom: 2,
    },
    navItemActive: { background: "#1E6FE8", color: "#fff" },
    navBadge: {
        marginLeft: "auto",
        background: "#EF4444",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 20,
    },
    sidebarFooter: {
        marginTop: "auto",
        padding: "16px 12px",
        borderTop: "1px solid rgba(255,255,255,.07)",
    },
    userCard: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: 8,
        background: "rgba(255,255,255,.05)",
        cursor: "pointer",
    },
    userAvatar: {
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "#1E6FE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
    },
    userName: { fontSize: 13, fontWeight: 600, color: "#fff" },
    userRole: { fontSize: 11, color: "rgba(255,255,255,.35)" },
    logoutBtn: {
        marginTop: 8,
        width: "100%",
        padding: 8,
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 7,
        background: "transparent",
        color: "rgba(255,255,255,.4)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        cursor: "pointer",
    },

    /* ── main ── */
    main: { flex: 1, padding: "28px 32px", overflowX: "hidden" },
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "#9AA3B8",
        marginBottom: 8,
    },
    pageHeader: { marginBottom: 28 },
    pageTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: "#0F1F3D",
        marginBottom: 4,
    },
    pageDesc: { color: "#4A5270", fontSize: 13 },

    /* ── stat cards ── */
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        background: "#fff",
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 2px 16px rgba(15,31,61,.08)",
        border: "1px solid #EEF0F5",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
    },
    statCardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    statCardLabel: {
        fontSize: 12,
        fontWeight: 600,
        color: "#9AA3B8",
        textTransform: "uppercase",
        letterSpacing: ".5px",
    },
    statCardIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statCardVal: { fontSize: 26, fontWeight: 700, color: "#0F1F3D" },
    statCardSub: { fontSize: 12, color: "#9AA3B8" },
    trend: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
    },
    trendUp: { color: "#10B981", background: "rgba(16,185,129,.1)" },
    trendDown: { color: "#EF4444", background: "rgba(239,68,68,.1)" },

    /* ── layout ── */
    twoCol: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        marginBottom: 20,
    },
    card: {
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(15,31,61,.08)",
        border: "1px solid #EEF0F5",
        overflow: "hidden",
        marginBottom: 20,
    },
    cardHeader: {
        padding: "18px 22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #EEF0F5",
    },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "#0F1F3D" },
    cardSubtitle: { fontSize: 12, color: "#9AA3B8", marginTop: 2 },

    /* ── chart ── */
    chartArea: {
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        height: 160,
        padding: "16px 22px 8px",
    },
    chartBarWrap: {
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
    },
    chartBar: {
        width: "100%",
        borderRadius: "6px 6px 0 0",
        background: "#1E6FE8",
        cursor: "pointer",
        transition: "opacity .2s",
    },
    chartLabels: {
        display: "flex",
        gap: 12,
        padding: "0 22px 16px",
        fontSize: 11,
        color: "#9AA3B8",
    },
    chartLabel: { flex: 1, textAlign: "center" as const },
    chartLabelActive: {
        flex: 1,
        textAlign: "center" as const,
        color: "#1E6FE8",
        fontWeight: 700,
    },

    /* ── timeline ── */
    timeline: {
        padding: "16px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    tlItem: { display: "flex", gap: 12, alignItems: "flex-start" },
    tlDot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        flexShrink: 0,
        marginTop: 4,
    },
    tlLabel: { fontSize: 13, fontWeight: 600, color: "#0F1F3D" },
    tlSub: { fontSize: 11, color: "#9AA3B8" },
    tlAmount: { fontSize: 13, fontWeight: 700, color: "#10B981", marginTop: 2 },

    /* ── table ── */
    th: {
        textAlign: "left",
        padding: "11px 16px",
        fontSize: 11,
        fontWeight: 700,
        color: "#9AA3B8",
        textTransform: "uppercase",
        letterSpacing: ".5px",
        borderBottom: "1px solid #EEF0F5",
        background: "#F7F8FA",
    },
    td: {
        padding: "13px 16px",
        borderBottom: "1px solid #EEF0F5",
        fontSize: 13,
        color: "#4A5270",
    },
    tr: {},
    badge: {
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
    },

    /* ── buttons ── */
    btnPrimary: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        background: "#1E6FE8",
        color: "#fff",
    },
    btnOutline: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 16px",
        borderRadius: 8,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        background: "transparent",
        color: "#4A5270",
        border: "1px solid #D6DBE8",
    },
    btnSm: {
        padding: "6px 12px",
        borderRadius: 7,
        border: "1px solid #1E6FE8",
        background: "rgba(30,111,232,.08)",
        color: "#1E6FE8",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
    },
};

export default Dashboard;
