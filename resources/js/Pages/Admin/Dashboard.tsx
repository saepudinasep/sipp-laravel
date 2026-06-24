import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

interface Stats {
    total_siswa: number;
    total_kelas: number;
    sudah_bayar: number;
    belum_bayar: number;
    persen_sudah_bayar: number;
    persen_belum_bayar: number;
    total_pemasukan_bulan_ini: number;
    bulan_label: string;
    tahun_ajaran: string | null;
}

interface TrenItem {
    label: string;
    total: number;
    persen: number;
    aktif: boolean;
}

interface AktivitasItem {
    nama: string;
    kelas: string;
    keterangan: string;
    waktu: string;
    nominal: number;
}

interface Props {
    stats: Stats;
    tren: TrenItem[];
    aktivitas: AktivitasItem[];
}

function formatRupiahSingkat(value: number) {
    if (value >= 1_000_000) {
        return (
            "Rp " + (value / 1_000_000).toFixed(2).replace(/\.00$/, "") + "jt"
        );
    }
    if (value >= 1_000) {
        return "Rp " + (value / 1_000).toFixed(0) + "rb";
    }
    return "Rp " + value.toLocaleString("id-ID");
}

const ICON_SISWA =
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z";
const ICON_CHECK = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
const ICON_WARNING =
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
const ICON_MONEY =
    "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";

export default function Dashboard({ stats, tren, aktivitas }: Props) {
    return (
        <AppLayout title="Dashboard Admin">
            <Head title="Dashboard Admin" />

            <div className="breadcrumb">
                SiPP · <span>Dashboard</span>
            </div>
            <div className="page-header">
                <h1>Dashboard Admin</h1>
                <p>
                    Selamat datang! Berikut ringkasan aktivitas pembayaran SPP
                    hari ini.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Total Siswa</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_SISWA} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">{stats.total_siswa}</div>
                        <div className="stat-card-sub">
                            {stats.total_kelas} kelas aktif
                        </div>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Sudah Bayar</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_CHECK} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">{stats.sudah_bayar}</div>
                        <div className="stat-card-sub">
                            {stats.bulan_label} · {stats.persen_sudah_bayar}%
                        </div>
                    </div>
                </div>

                <div className="stat-card amber">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Belum Bayar</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_WARNING} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">{stats.belum_bayar}</div>
                        <div className="stat-card-sub">
                            {stats.bulan_label} · {stats.persen_belum_bayar}%
                        </div>
                    </div>
                    {stats.belum_bayar > 0 && (
                        <div>
                            <span className="stat-trend down">
                                ↓ Perlu tindak lanjut
                            </span>
                        </div>
                    )}
                </div>

                <div className="stat-card blue">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Total Pemasukan</div>
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24">
                                <path d={ICON_MONEY} />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            {formatRupiahSingkat(
                                stats.total_pemasukan_bulan_ini,
                            )}
                        </div>
                        <div className="stat-card-sub">
                            Bulan {stats.bulan_label} {stats.tahun_ajaran ?? ""}
                        </div>
                    </div>
                </div>
            </div>

            <div className="two-col">
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Tren Pembayaran</div>
                            <div className="card-subtitle">
                                6 bulan terakhir
                            </div>
                        </div>
                    </div>
                    <div className="chart-area">
                        {tren.map((t, i) => (
                            <div
                                key={i}
                                className="chart-bar"
                                style={{
                                    height: `${t.persen}%`,
                                    opacity: t.aktif ? 1 : undefined,
                                }}
                                title={t.label}
                            />
                        ))}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            padding: "0 22px 16px",
                            fontSize: 11,
                            color: "var(--gray3)",
                        }}
                    >
                        {tren.map((t, i) => (
                            <span
                                key={i}
                                style={
                                    t.aktif
                                        ? {
                                              color: "var(--blue)",
                                              fontWeight: 700,
                                          }
                                        : undefined
                                }
                            >
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Aktivitas Terkini</div>
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
                            Belum ada aktivitas transaksi.
                        </div>
                    ) : (
                        <div className="timeline">
                            {aktivitas.map((a, i) => (
                                <div className="tl-item" key={i}>
                                    <div
                                        className="tl-dot"
                                        style={{
                                            background: "var(--green)",
                                        }}
                                    />
                                    <div className="tl-content">
                                        <div className="tl-label">
                                            {a.nama} — {a.kelas}
                                        </div>
                                        <div className="tl-sub">
                                            {a.keterangan} · {a.waktu}
                                        </div>
                                        <div className="tl-amount">
                                            + Rp{" "}
                                            {a.nominal.toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
