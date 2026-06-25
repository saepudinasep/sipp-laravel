import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        nip: "",
        jabatan: "",
        email: "",
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.petugas.store"));
    };

    return (
        <AppLayout title="Tambah Petugas">
            <Head title="Tambah Petugas" />

            <div className="breadcrumb">
                <Link href={route("admin.petugas.index")}>Data Petugas</Link> ·{" "}
                <span>Tambah Petugas</span>
            </div>
            <div className="page-header">
                <h1>Tambah Petugas Baru</h1>
                <p>
                    Lengkapi data petugas beserta akun login untuk portal
                    petugas.
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="two-col">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Data Pribadi</div>
                        </div>
                        <div className="card-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">
                                        Nama Lengkap{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: Ibu Wati"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData("nama", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.nama}
                                        className="form-error"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        NIP <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="19800101200001001"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData("nip", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.nip}
                                        className="form-error"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Jabatan <span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Contoh: Staff Keuangan"
                                    value={data.jabatan}
                                    onChange={(e) =>
                                        setData("jabatan", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.jabatan}
                                    className="form-error"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ alignSelf: "start" }}>
                        <div className="card-header">
                            <div className="card-title">Akun Login</div>
                        </div>
                        <div className="card-body">
                            <div
                                className="info-panel"
                                style={{ marginBottom: 18 }}
                            >
                                <div className="info-panel-title">Info</div>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--gray4)",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Akun ini akan digunakan petugas untuk masuk
                                    ke portal transaksi pembayaran SPP.
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Email <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="nama@sekolah.id"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="form-error"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Password <span className="req">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Minimal 6 karakter"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="form-error"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 4,
                    }}
                >
                    <Link
                        href={route("admin.petugas.index")}
                        className="btn btn-outline"
                    >
                        Batal
                    </Link>
                    <LoadingButton
                        type="submit"
                        loading={processing}
                        loadingText="Menyimpan..."
                    >
                        Simpan Petugas
                    </LoadingButton>
                </div>
            </form>
        </AppLayout>
    );
}
