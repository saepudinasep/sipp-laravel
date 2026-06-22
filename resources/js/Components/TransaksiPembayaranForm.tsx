import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";

interface SiswaRingkas {
    id: number;
    nama: string;
    nis: string;
    kelas: string | null;
}

interface SiswaTerpilih {
    id: number;
    nama: string;
    nis: string;
    kelas: { nama_kelas: string } | null;
}

interface SppOption {
    id: number;
    jenis: string;
    bulan: number;
    bulan_label: string;
    tahun_ajaran: string;
    nominal: number;
    label: string;
}

interface StatusBulan {
    bulan_label: string;
    tahun_ajaran: string;
    lunas: boolean;
}

interface Props {
    siswaTerpilih: SiswaTerpilih | null;
    sppBelumLunas: SppOption[];
    statusBulan: StatusBulan[];
    /** Nama petugas yang sedang login. */
    petugasNama: string;
}

function formatRupiah(value: number) {
    return "Rp " + value.toLocaleString("id-ID");
}

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function formatTanggalIndo(iso: string) {
    if (!iso) return "—";
    const date = new Date(iso + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Form Entri Pembayaran — khusus role Petugas. Petugas penerima selalu
 * otomatis dari akun yang login (tidak ada pilihan petugas lain), karena
 * tabel `transaksis` mewajibkan `petugas_id` yang merepresentasikan siapa
 * yang benar-benar menerima pembayaran.
 */
export default function TransaksiPembayaranForm({
    siswaTerpilih,
    sppBelumLunas,
    statusBulan,
    petugasNama,
}: Props) {
    const [query, setQuery] = useState(siswaTerpilih?.nama ?? "");
    const [results, setResults] = useState<SiswaRingkas[]>([]);
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Saat true, perubahan `query` berikutnya (akibat memilih siswa dari
    // dropdown, bukan mengetik manual) tidak memicu pencarian otomatis.
    const skipNextSearchRef = useRef(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: siswaTerpilih?.id ? String(siswaTerpilih.id) : "",
        spp_id: "",
        tgl_bayar: todayISO(),
        keterangan: "",
    });

    // Live search siswa: cari otomatis 350ms setelah berhenti mengetik,
    // minimal 3 karakter (selaras dengan hint di form).
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return;
        }

        if (query.trim().length < 3) {
            setResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    route("petugas.transaksi.cari-siswa") +
                        "?q=" +
                        encodeURIComponent(query.trim()),
                    { headers: { Accept: "application/json" } },
                );
                const json = await res.json();
                setResults(json);
                setShowResults(true);
            } finally {
                setSearching(false);
            }
        }, 350);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const pilihSiswa = (siswa: SiswaRingkas) => {
        skipNextSearchRef.current = true;
        setQuery(siswa.nama);
        setResults([]);
        setShowResults(false);
        setData("siswa_id", String(siswa.id));
        setData("spp_id", "");
        router.get(
            route("petugas.transaksi.index"),
            { siswa_id: siswa.id },
            { preserveState: true, replace: true },
        );
    };

    const selectedSpp = sppBelumLunas.find((s) => String(s.id) === data.spp_id);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("petugas.transaksi.store"), {
            onSuccess: () => {
                reset("spp_id", "keterangan");
                setData("tgl_bayar", todayISO());
            },
        });
    };

    const handleReset = () => {
        setQuery("");
        setResults([]);
        reset();
        setData("tgl_bayar", todayISO());
        router.get(route("petugas.transaksi.index"));
    };

    const canSubmit = !!data.siswa_id && !!data.spp_id;

    return (
        <div className="two-col">
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Form Pembayaran</div>
                </div>
                <div className="card-body">
                    <form onSubmit={submit}>
                        <div
                            className="form-group"
                            style={{ position: "relative" }}
                        >
                            <label className="form-label">
                                Pilih Siswa <span className="req">*</span>
                            </label>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ flex: 1 }}
                                    placeholder="Cari nama / NIS siswa..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (data.siswa_id) {
                                            setData("siswa_id", "");
                                            setData("spp_id", "");
                                        }
                                    }}
                                    onFocus={() =>
                                        !data.siswa_id &&
                                        results.length > 0 &&
                                        setShowResults(true)
                                    }
                                    onBlur={() => {
                                        // Delay kecil agar klik pada item
                                        // dropdown (onMouseDown) tetap
                                        // diproses sebelum dropdown ditutup.
                                        setTimeout(
                                            () => setShowResults(false),
                                            150,
                                        );
                                    }}
                                />
                            </div>
                            <div className="form-hint">
                                {searching
                                    ? "Mencari..."
                                    : "Ketik minimal 3 karakter untuk mencari"}
                            </div>
                            <InputError
                                message={errors.siswa_id}
                                className="form-error"
                            />

                            {showResults && results.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        background: "var(--white)",
                                        border: "1px solid var(--gray2)",
                                        borderRadius: "var(--radius)",
                                        boxShadow: "var(--shadow2)",
                                        zIndex: 20,
                                        marginTop: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    {results.map((s) => (
                                        <button
                                            type="button"
                                            key={s.id}
                                            onClick={() => pilihSiswa(s)}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "10px 14px",
                                                border: "none",
                                                background: "none",
                                                cursor: "pointer",
                                                borderBottom:
                                                    "1px solid var(--gray1)",
                                            }}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: "var(--text)",
                                                }}
                                            >
                                                {s.nama}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    color: "var(--gray3)",
                                                }}
                                            >
                                                {s.nis}
                                                {s.kelas ? ` · ${s.kelas}` : ""}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {siswaTerpilih && (
                            <div className="info-panel">
                                <div className="info-panel-title">
                                    Informasi Siswa
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Nama</span>
                                    <span className="info-val">
                                        {siswaTerpilih.nama}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">NIS</span>
                                    <span className="info-val">
                                        {siswaTerpilih.nis}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Kelas</span>
                                    <span className="info-val">
                                        {siswaTerpilih.kelas?.nama_kelas ?? "—"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">
                                    Jenis SPP <span className="req">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={data.spp_id}
                                    disabled={!siswaTerpilih}
                                    onChange={(e) =>
                                        setData("spp_id", e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Pilih Jenis SPP --
                                    </option>
                                    {sppBelumLunas.map((spp) => (
                                        <option key={spp.id} value={spp.id}>
                                            {spp.label}
                                        </option>
                                    ))}
                                </select>
                                {siswaTerpilih &&
                                    sppBelumLunas.length === 0 && (
                                        <div className="form-hint">
                                            Semua SPP siswa ini sudah lunas.
                                        </div>
                                    )}
                                <InputError
                                    message={errors.spp_id}
                                    className="form-error"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Nominal Bayar
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    readOnly
                                    value={
                                        selectedSpp
                                            ? formatRupiah(selectedSpp.nominal)
                                            : "Rp 0"
                                    }
                                    style={{
                                        background: "var(--gray0)",
                                        fontWeight: 700,
                                        color: "var(--blue)",
                                    }}
                                />
                                <div className="form-hint">
                                    Otomatis dari jenis SPP
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Tanggal Bayar <span className="req">*</span>
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                value={data.tgl_bayar}
                                onChange={(e) =>
                                    setData("tgl_bayar", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.tgl_bayar}
                                className="form-error"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Keterangan</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Catatan tambahan (opsional)..."
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.keterangan}
                                className="form-error"
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <LoadingButton
                                type="submit"
                                loading={processing}
                                loadingText="Menyimpan..."
                                disabled={!canSubmit}
                                style={{ flex: 1 }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                Simpan Pembayaran
                            </LoadingButton>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div>
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-header">
                        <div className="card-title">Ringkasan Transaksi</div>
                    </div>
                    <div className="card-body">
                        <div className="info-panel">
                            <div className="info-row">
                                <span className="info-key">Siswa</span>
                                <span className="info-val">
                                    {siswaTerpilih?.nama ?? "—"}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-key">SPP</span>
                                <span className="info-val">
                                    {selectedSpp
                                        ? `${selectedSpp.bulan_label} ${selectedSpp.tahun_ajaran}`
                                        : "—"}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-key">Tanggal</span>
                                <span className="info-val">
                                    {formatTanggalIndo(data.tgl_bayar)}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-key">Petugas</span>
                                <span className="info-val">{petugasNama}</span>
                            </div>
                            <div
                                style={{
                                    borderTop: "1px solid var(--gray2)",
                                    margin: "10px 0",
                                    paddingTop: 10,
                                }}
                            >
                                <div className="info-row">
                                    <span
                                        className="info-key"
                                        style={{ fontWeight: 700 }}
                                    >
                                        Total
                                    </span>
                                    <span className="info-val big">
                                        {formatRupiah(
                                            selectedSpp?.nominal ?? 0,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Status Bulan Ini</div>
                    </div>
                    <div className="card-body">
                        {!siswaTerpilih ? (
                            <p
                                style={{
                                    fontSize: 13,
                                    color: "var(--gray3)",
                                }}
                            >
                                Pilih siswa terlebih dahulu untuk melihat status
                                pembayaran.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                {statusBulan.map((s, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: 13,
                                        }}
                                    >
                                        <span>
                                            {s.bulan_label} {s.tahun_ajaran}
                                        </span>
                                        {s.lunas ? (
                                            <span className="badge badge-green">
                                                ✓ LUNAS
                                            </span>
                                        ) : (
                                            <span className="badge badge-red">
                                                ✗ BELUM
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
