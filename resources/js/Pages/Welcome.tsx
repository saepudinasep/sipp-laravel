import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef } from "react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const navbarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Navbar scroll effect
        const handleScroll = () => {
            if (navbarRef.current) {
                if (window.scrollY > 20) {
                    navbarRef.current.classList.add("scrolled");
                } else {
                    navbarRef.current.classList.remove("scrolled");
                }
            }
        };
        window.addEventListener("scroll", handleScroll);

        // Scroll reveal
        const reveals = document.querySelectorAll<HTMLElement>(".reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 },
        );
        reveals.forEach((el) => observer.observe(el));

        // Hero content visible immediately
        document
            .querySelectorAll(".hero .reveal")
            .forEach((el) => el.classList.add("visible"));

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Head title="Sistem Pembayaran SPP Digital" />
            {/* NAVBAR */}
            <nav className="navbar" ref={navbarRef}>
                <a className="nav-logo" href="#">
                    <div className="nav-logo-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                        </svg>
                    </div>
                    <span className="nav-logo-name">
                        Si<span>PP</span>
                    </span>
                </a>
                <div className="nav-links">
                    <a href="#fitur">Fitur</a>
                    <a href="#cara-kerja">Cara Kerja</a>
                    <a href="#pengguna">Pengguna</a>
                </div>
                <div className="nav-cta">
                    <a href="#" className="btn-ghost">
                        Pelajari Lebih
                    </a>
                    <Link href="/login" className="btn-primary-sm">
                        Masuk ke Sistem →
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-deco" />
                <div className="hero-grid" />
                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="hero-badge reveal">
                            <div className="hero-badge-dot" />
                            Platform Aktif · Versi 2.0
                        </div>
                        <h1 className="hero-title reveal">
                            Kelola SPP Sekolah
                            <br />
                            <span className="accent">Lebih Cerdas,</span>
                            <br />
                            <span className="line2">Lebih Tertib.</span>
                        </h1>
                        <p className="hero-desc reveal">
                            SiPP membantu sekolah mengelola pembayaran SPP
                            secara digital — dari pencatatan otomatis, laporan
                            real-time, hingga notifikasi tunggakan. Satu sistem
                            untuk admin, petugas, dan siswa.
                        </p>
                        <div className="hero-actions reveal">
                            <Link href="/login" className="btn-hero">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                >
                                    <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18z" />
                                </svg>
                                Mulai Sekarang
                            </Link>
                            <a href="#fitur" className="btn-hero-outline">
                                Lihat Fitur ↓
                            </a>
                        </div>
                        <div className="hero-stats reveal">
                            <div className="hstat">
                                <div className="hstat-num">
                                    1.200<sup>+</sup>
                                </div>
                                <div className="hstat-label">
                                    Siswa Terdaftar
                                </div>
                            </div>
                            <div className="hstat">
                                <div className="hstat-num">
                                    98<sup>%</sup>
                                </div>
                                <div className="hstat-label">
                                    Akurasi Pencatatan
                                </div>
                            </div>
                            <div className="hstat">
                                <div className="hstat-num">6</div>
                                <div className="hstat-label">Jurusan Aktif</div>
                            </div>
                        </div>
                    </div>

                    {/* MOCK DASHBOARD */}
                    <div className="hero-visual">
                        <div className="hero-card-wrap">
                            <div className="mock-card">
                                <div className="mock-card-head">
                                    <span className="mock-card-title">
                                        Rekap Bulan Ini
                                    </span>
                                    <span className="mock-badge-green">
                                        ● Live
                                    </span>
                                </div>
                                <div className="mock-amount">Rp 28,35 jt</div>
                                <div className="mock-sub">
                                    Total terkumpul · Maret 2024
                                </div>
                                <div className="mock-bar-bg">
                                    <div className="mock-bar-fill" />
                                </div>
                                <div className="mock-bar-label">
                                    <span>75% target tercapai</span>
                                    <span>Target Rp 37,8 jt</span>
                                </div>
                            </div>
                            <div className="mock-rows">
                                {[
                                    {
                                        initials: "AF",
                                        name: "Ahmad Fauzi",
                                        kelas: "XI RPL 1 · NIS 2019001",
                                        color: "#1E6FE8",
                                        status: "lunas",
                                    },
                                    {
                                        initials: "SR",
                                        name: "Siti Rahayu",
                                        kelas: "X AKL 2 · NIS 2020015",
                                        color: "#10B981",
                                        status: "belum",
                                    },
                                    {
                                        initials: "BW",
                                        name: "Budi Wicaksono",
                                        kelas: "XII MM 1 · NIS 2018033",
                                        color: "#7C3AED",
                                        status: "lunas",
                                    },
                                ].map((s) => (
                                    <div className="mock-row" key={s.initials}>
                                        <div className="mock-row-left">
                                            <div
                                                className="mock-avatar"
                                                style={{ background: s.color }}
                                            >
                                                {s.initials}
                                            </div>
                                            <div>
                                                <div className="mock-name">
                                                    {s.name}
                                                </div>
                                                <div className="mock-class">
                                                    {s.kelas}
                                                </div>
                                            </div>
                                        </div>
                                        {s.status === "lunas" ? (
                                            <div className="mock-lunas">
                                                ✓ LUNAS
                                            </div>
                                        ) : (
                                            <div className="mock-belum">
                                                ⏳ BELUM
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUSTED BY */}
            <div className="trusted">
                <span className="trusted-label">Digunakan oleh</span>
                <div className="trusted-schools">
                    {[
                        "SMK RPL Nusantara",
                        "SMK Teknologi Maju",
                        "SMK Bina Karya",
                        "SMK Dharma Bhakti",
                    ].map((s, i) => (
                        <span key={s} className="school-tag">
                            {i > 0 ? "· " : ""}
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* FITUR */}
            <section className="section" id="fitur">
                <div className="section-inner">
                    <div className="reveal">
                        <p className="section-eyebrow">Fitur Unggulan</p>
                        <h2 className="section-title">
                            Semua yang dibutuhkan
                            <br />
                            sekolah modern
                        </h2>
                        <p className="section-subtitle">
                            Dari input pembayaran harian hingga laporan akhir
                            tahun ajaran, SiPP menangani semuanya dengan rapi
                            dan akurat.
                        </p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card reveal reveal-delay-1">
                            <div className="feature-icon blue">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#1E6FE8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="3"
                                        width="20"
                                        height="14"
                                        rx="2"
                                    />
                                    <path d="M8 21h8M12 17v4" />
                                </svg>
                            </div>
                            <h3 className="feature-title">
                                Dashboard Real-time
                            </h3>
                            <p className="feature-desc">
                                Pantau total pemasukan, jumlah siswa lunas, dan
                                tunggakan dalam satu tampilan ringkas yang
                                selalu terkini.
                            </p>
                        </div>
                        <div className="feature-card reveal reveal-delay-2">
                            <div className="feature-icon green">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 12l2 2 4-4" />
                                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">
                                Entri Pembayaran Cepat
                            </h3>
                            <p className="feature-desc">
                                Cari siswa, pilih bulan, dan catat pembayaran
                                dalam hitungan detik. Nominal otomatis terisi
                                sesuai jenis SPP.
                            </p>
                        </div>
                        <div className="feature-card reveal reveal-delay-3">
                            <div className="feature-icon amber">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Laporan Otomatis</h3>
                            <p className="feature-desc">
                                Ekspor laporan bulanan, rekap per kelas, dan
                                histori transaksi lengkap dalam format yang siap
                                cetak.
                            </p>
                        </div>
                        <div className="feature-card reveal reveal-delay-1">
                            <div className="feature-icon blue">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#1E6FE8"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <h3 className="feature-title">
                                Manajemen Multi-Peran
                            </h3>
                            <p className="feature-desc">
                                Admin, petugas TU, dan siswa memiliki akses
                                sesuai peran masing-masing. Data aman dan
                                terstruktur.
                            </p>
                        </div>
                        <div className="feature-card reveal reveal-delay-2">
                            <div className="feature-icon green">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3 className="feature-title">
                                Histori Transparan
                            </h3>
                            <p className="feature-desc">
                                Setiap transaksi tercatat dengan tanggal,
                                petugas, dan nominal. Siswa bisa cek riwayat
                                bayar kapan saja.
                            </p>
                        </div>
                        <div className="feature-card reveal reveal-delay-3">
                            <div className="feature-icon amber">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className="feature-title">
                                Data Terpusat & Aman
                            </h3>
                            <p className="feature-desc">
                                Semua data siswa, kelas, dan transaksi tersimpan
                                terpusat. Tidak ada lagi catatan manual yang
                                hilang.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARA KERJA */}
            <section className="section howto" id="cara-kerja">
                <div className="section-inner">
                    <div
                        className="reveal"
                        style={{ textAlign: "center", marginBottom: 0 }}
                    >
                        <p className="section-eyebrow">Cara Kerja</p>
                        <h2 className="section-title">
                            Mulai dalam 4 langkah mudah
                        </h2>
                        <p
                            className="section-subtitle"
                            style={{ margin: "0 auto" }}
                        >
                            Tidak perlu pelatihan panjang. Sistem dirancang agar
                            langsung bisa digunakan oleh staf TU sekolah.
                        </p>
                    </div>
                    <div className="steps">
                        {[
                            {
                                num: "1",
                                title: "Admin Setup Data",
                                desc: "Input data kelas, siswa, dan jenis SPP ke dalam sistem. Cukup dilakukan sekali di awal tahun ajaran.",
                            },
                            {
                                num: "2",
                                title: "Petugas Terima Bayar",
                                desc: "Petugas TU mencatat pembayaran dari siswa harian melalui form entri yang cepat dan mudah.",
                            },
                            {
                                num: "3",
                                title: "Sistem Catat Otomatis",
                                desc: "Data tersimpan real-time. Status lunas/belum langsung terupdate di dashboard admin dan akun siswa.",
                            },
                            {
                                num: "4",
                                title: "Laporan Siap Cetak",
                                desc: "Admin bisa ekspor laporan kapan saja — per bulan, per kelas, atau rekap tahunan — dalam hitungan klik.",
                            },
                        ].map((s, i) => (
                            <div
                                className={`step reveal reveal-delay-${i + 1}`}
                                key={s.num}
                            >
                                <div className="step-num">{s.num}</div>
                                <h4 className="step-title">{s.title}</h4>
                                <p className="step-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PENGGUNA */}
            <section className="section" id="pengguna">
                <div className="section-inner">
                    <div className="reveal">
                        <p className="section-eyebrow">Untuk Siapa</p>
                        <h2 className="section-title">
                            Tiga peran, satu ekosistem
                        </h2>
                        <p className="section-subtitle">
                            SiPP dirancang khusus untuk kebutuhan nyata setiap
                            pengguna di lingkungan sekolah.
                        </p>
                    </div>
                    <div className="roles-grid">
                        <div className="role-card admin reveal reveal-delay-1">
                            <div className="role-icon-wrap">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                            <p className="role-name">Akses Penuh</p>
                            <h3 className="role-title">Administrator</h3>
                            <p className="role-desc">
                                Kelola seluruh sistem — dari data master hingga
                                laporan keuangan sekolah.
                            </p>
                            <ul className="role-features">
                                <li>Kelola data siswa, kelas &amp; petugas</li>
                                <li>Konfigurasi jenis &amp; nominal SPP</li>
                                <li>Lihat laporan &amp; rekap lengkap</li>
                                <li>Monitor semua transaksi masuk</li>
                            </ul>
                        </div>
                        <div className="role-card petugas reveal reveal-delay-2">
                            <div className="role-icon-wrap">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                </svg>
                            </div>
                            <p className="role-name">Operasional Harian</p>
                            <h3 className="role-title">Petugas TU</h3>
                            <p className="role-desc">
                                Fokus pada penerimaan pembayaran dan pencatatan
                                transaksi harian yang cepat dan akurat.
                            </p>
                            <ul className="role-features">
                                <li>Entri pembayaran SPP siswa</li>
                                <li>Cari &amp; verifikasi data siswa</li>
                                <li>Lihat histori transaksi hari ini</li>
                                <li>Cetak kwitansi pembayaran</li>
                            </ul>
                        </div>
                        <div className="role-card siswa reveal reveal-delay-3">
                            <div className="role-icon-wrap">
                                <svg viewBox="0 0 24 24">
                                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                </svg>
                            </div>
                            <p className="role-name">Pantau Mandiri</p>
                            <h3 className="role-title">Siswa</h3>
                            <p className="role-desc">
                                Cek status pembayaran sendiri kapan saja tanpa
                                perlu antri ke TU atau tanya orang tua.
                            </p>
                            <ul className="role-features">
                                <li>Status lunas/belum per bulan</li>
                                <li>Riwayat semua transaksi</li>
                                <li>Informasi sisa tunggakan</li>
                                <li>Detail tahun ajaran berjalan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BIG STATS */}
            <div className="stats-section">
                <div className="stats-section-inner">
                    {[
                        {
                            num: "1.200",
                            suffix: "+",
                            label: "Siswa dikelola aktif",
                        },
                        {
                            num: "28",
                            suffix: "jt+",
                            label: "SPP terkumpul per bulan",
                        },
                        { num: "99", suffix: "%", label: "Uptime sistem" },
                        { num: "0", suffix: "", label: "Data yang hilang" },
                    ].map((s, i) => (
                        <div
                            className={`reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}
                            key={s.label}
                        >
                            <div className="big-stat-num">
                                <span>{s.num}</span>
                                {s.suffix}
                            </div>
                            <div className="big-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-inner">
                    <h2 className="cta-title reveal">
                        Siap mengakhiri chaos pencatatan SPP?
                    </h2>
                    <p className="cta-sub reveal reveal-delay-1">
                        Bergabunglah dengan sekolah-sekolah yang sudah beralih
                        ke sistem digital. Tidak perlu instalasi rumit.
                    </p>
                    <div className="cta-actions reveal reveal-delay-2">
                        <Link href="/login" className="btn-white">
                            Masuk ke SiPP →
                        </Link>
                        <a href="#fitur" className="btn-outline-white">
                            Pelajari Fitur
                        </a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <div className="footer-brand-logo">
                                <div className="footer-logo-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                    </svg>
                                </div>
                                <span className="footer-logo-name">
                                    Si<span>PP</span>
                                </span>
                            </div>
                            <p className="footer-tagline">
                                Sistem Pembayaran SPP Digital untuk sekolah
                                menengah kejuruan yang modern dan teratur.
                            </p>
                        </div>
                        <div className="footer-links-col">
                            <p className="footer-col-title">Sistem</p>
                            <a href="#">Dashboard Admin</a>
                            <a href="#">Entri Pembayaran</a>
                            <a href="#">Laporan</a>
                            <a href="#">Data Siswa</a>
                        </div>
                        <div className="footer-links-col">
                            <p className="footer-col-title">Informasi</p>
                            <a href="#">Panduan Penggunaan</a>
                            <a href="#">FAQ</a>
                            <a href="#">Kontak TU</a>
                        </div>
                        <div className="footer-links-col">
                            <p className="footer-col-title">Sekolah</p>
                            <a href="#">SMK RPL Nusantara</a>
                            <a href="#">Kalender Akademik</a>
                            <a href="#">Struktur Organisasi</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copy">
                            © 2024 SiPP — Sistem Pembayaran SPP. Dikembangkan
                            untuk SMK RPL.
                        </p>
                        <span className="footer-version">v2.0.0</span>
                    </div>
                </div>
            </footer>
        </>
    );
}
