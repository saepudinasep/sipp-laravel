import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

interface Stats {
    transaksi_hari_ini: number;
    total_nominal_hari_ini: number;
    siswa_unik_hari_ini: number;
}

interface AktivitasItem {
    nama: string;
    kelas: string;
    keterangan: string;
    waktu: string;
    nominal: number;
}

interface Props {
    petugasNama: string;
    stats: Stats;
    aktivitas: AktivitasItem[];
}

const ICON_TRANSAKSI =
    "M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z";
const ICON_MONEY =
    "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";
const ICON_SISWA =
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z";

export default function Dashboard({ petugasNama, stats, aktivitas }: Props) {
    return (
        <AppLayout title="Dashboard Petugas">
            <Head title="Dashboard Petugas" />

            <div className="breadcrumb">
                SiPP · <span>Dashboard</span>
            </div>
            <div className="page-header">
                <h1>Halo, {petugasNama} 👋</h1>
                <p>
                    Ringkasan transaksi pembayaran SPP yang Anda input hari ini.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-card-top">
                        <div className="stat-card-label">
                            Transaksi Hari Ini
                        </div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_TRANSAKSI} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            {stats.transaksi_hari_ini}
                        </div>
                        <div className="stat-card-sub">Pembayaran tercatat</div>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Total Nominal</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_MONEY} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            Rp{" "}
                            {stats.total_nominal_hari_ini.toLocaleString(
                                "id-ID",
                            )}
                        </div>
                        <div className="stat-card-sub">Terkumpul hari ini</div>
                    </div>
                </div>

                <div className="stat-card amber">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Siswa Membayar</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_SISWA} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            {stats.siswa_unik_hari_ini}
                        </div>
                        <div className="stat-card-sub">Siswa unik</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Transaksi Terbaru Anda</div>
                    <Link
                        href={route("petugas.transaksi.index")}
                        className="btn btn-primary btn-sm"
                    >
                        + Entri Pembayaran
                    </Link>
                </div>
                {aktivitas.length === 0 ? (
                    <div
                        style={{
                            padding: "32px 22px",
                            textAlign: "center",
                            fontSize: 13,
                            color: "var(--gray3)",
                        }}
                    >
                        Belum ada transaksi yang Anda input.
                    </div>
                ) : (
                    <div className="timeline">
                        {aktivitas.map((a, i) => (
                            <div className="tl-item" key={i}>
                                <div
                                    className="tl-dot"
                                    style={{ background: "var(--green)" }}
                                />
                                <div className="tl-content">
                                    <div className="tl-label">
                                        {a.nama} — {a.kelas}
                                    </div>
                                    <div className="tl-sub">
                                        {a.keterangan} · {a.waktu}
                                    </div>
                                    <div className="tl-amount">
                                        + Rp {a.nominal.toLocaleString("id-ID")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
