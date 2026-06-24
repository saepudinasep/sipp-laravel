import AppLayout from "@/Layouts/AppLayout";
import EmptyState from "@/Components/EmptyState";
import { Head } from "@inertiajs/react";

interface SiswaInfo {
    nama: string;
    nis: string;
    kelas: string;
    tahun_ajaran: string | null;
}

interface Stats {
    bulan_lunas: number;
    bulan_belum: number;
    total_bulan: number;
    total_dibayar: number;
    sisa_tunggakan: number;
}

interface BulanStatusItem {
    bulan_label: string;
    tahun_ajaran: string;
    lunas: boolean;
}

interface RiwayatItem {
    tgl_bayar: string;
    jenis_spp: string;
    nominal: number;
    petugas_nama: string;
}

interface Props {
    siswa: SiswaInfo | null;
    stats: Stats | null;
    bulanStatus: BulanStatusItem[];
    riwayat: RiwayatItem[];
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

function formatTanggalIndo(iso: string) {
    const date = new Date(iso + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function Dashboard({
    siswa,
    stats,
    bulanStatus,
    riwayat,
}: Props) {
    if (!siswa || !stats) {
        return (
            <AppLayout title="Dashboard Siswa">
                <Head title="Dashboard Siswa" />
                <EmptyState
                    title="Akun belum terhubung ke data siswa"
                    description="Hubungi admin sekolah untuk menghubungkan akun ini ke data siswa."
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Dashboard Siswa">
            <Head title="Dashboard Siswa" />

            <div className="siswa-welcome">
                <div>
                    <h2>Halo, {siswa.nama}! 👋</h2>
                    <p>
                        {siswa.kelas} · NIS: {siswa.nis} · Tahun Ajaran{" "}
                        {siswa.tahun_ajaran ?? "—"}
                    </p>
                </div>
                <div className="siswa-avatar">{initials(siswa.nama)}</div>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card green">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Bulan Lunas</div>
                    </div>
                    <div>
                        <div className="stat-card-val">{stats.bulan_lunas}</div>
                        <div className="stat-card-sub">
                            dari {stats.total_bulan} bulan
                        </div>
                    </div>
                </div>

                <div className="stat-card amber">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Bulan Belum</div>
                    </div>
                    <div>
                        <div className="stat-card-val">{stats.bulan_belum}</div>
                        <div className="stat-card-sub">
                            {bulanStatus
                                .filter((b) => !b.lunas)
                                .slice(0, 3)
                                .map((b) => b.bulan_label)
                                .join(", ") || "—"}
                        </div>
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Total Dibayar</div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            {formatRupiahSingkat(stats.total_dibayar)}
                        </div>
                        <div className="stat-card-sub">
                            TA {siswa.tahun_ajaran ?? "—"}
                        </div>
                    </div>
                </div>

                <div className="stat-card red">
                    <div className="stat-card-top">
                        <div className="stat-card-label">Sisa Tunggakan</div>
                    </div>
                    <div>
                        <div className="stat-card-val">
                            {formatRupiahSingkat(stats.sisa_tunggakan)}
                        </div>
                        <div className="stat-card-sub">
                            {stats.bulan_belum} bulan belum lunas
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        Status Pembayaran Per Bulan
                    </div>
                    <div className="card-subtitle">
                        Tahun Ajaran {siswa.tahun_ajaran ?? "—"}
                    </div>
                </div>
                <div className="card-body">
                    <div className="month-grid">
                        {bulanStatus.map((b, i) => (
                            <div
                                key={i}
                                className={
                                    "month-card " +
                                    (b.lunas ? "lunas" : "belum")
                                }
                            >
                                <div className="month-icon">
                                    {b.lunas ? "✅" : "❌"}
                                </div>
                                <div className="month-name">
                                    {b.bulan_label}
                                </div>
                                <div className="month-status">
                                    {b.lunas ? "LUNAS" : "BELUM"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Riwayat Transaksi</div>
                </div>
                {riwayat.length === 0 ? (
                    <EmptyState
                        title="Belum ada riwayat pembayaran"
                        description="Transaksi pembayaran SPP kamu akan muncul di sini."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Jenis SPP</th>
                                    <th>Nominal</th>
                                    <th>Petugas</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riwayat.map((r, i) => (
                                    <tr key={i}>
                                        <td>
                                            {formatTanggalIndo(r.tgl_bayar)}
                                        </td>
                                        <td>{r.jenis_spp}</td>
                                        <td
                                            style={{
                                                fontWeight: 700,
                                                color: "var(--green)",
                                            }}
                                        >
                                            Rp{" "}
                                            {r.nominal.toLocaleString("id-ID")}
                                        </td>
                                        <td>{r.petugas_nama}</td>
                                        <td>
                                            <span className="badge badge-green">
                                                LUNAS
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
