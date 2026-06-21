import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Props {
    kelasList: Kelas[];
}

export default function Create({ kelasList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        nis: "",
        kelas_id: "",
        alamat: "",
        telp: "",
        email: "",
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.siswa.store"));
    };

    return (
        <AppLayout title="Tambah Siswa">
            <Head title="Tambah Siswa" />

            <div className="breadcrumb">
                <Link href={route("admin.siswa.index")}>Data Siswa</Link> ·{" "}
                <span>Tambah Siswa</span>
            </div>
            <div className="page-header">
                <h1>Tambah Siswa Baru</h1>
                <p>
                    Lengkapi data siswa beserta akun login untuk portal siswa.
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
                                        placeholder="Contoh: Ahmad Fauzi"
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
                                        NIS <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: 2026001"
                                        value={data.nis}
                                        onChange={(e) =>
                                            setData("nis", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.nis}
                                        className="form-error"
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">
                                        Kelas <span className="req">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={data.kelas_id}
                                        onChange={(e) =>
                                            setData("kelas_id", e.target.value)
                                        }
                                    >
                                        <option value="">Pilih kelas...</option>
                                        {kelasList.map((kelas) => (
                                            <option
                                                key={kelas.id}
                                                value={kelas.id}
                                            >
                                                {kelas.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.kelas_id}
                                        className="form-error"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        No. Telepon
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="0812-3456-7890"
                                        value={data.telp}
                                        onChange={(e) =>
                                            setData("telp", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.telp}
                                        className="form-error"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Alamat</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Alamat lengkap siswa"
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.alamat}
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
                                    Akun ini akan digunakan siswa untuk masuk ke
                                    portal cek status pembayaran SPP.
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Email <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="nama@siswa.id"
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
                        href={route("admin.siswa.index")}
                        className="btn btn-outline"
                    >
                        Batal
                    </Link>
                    <LoadingButton
                        type="submit"
                        loading={processing}
                        loadingText="Menyimpan..."
                    >
                        Simpan Data
                    </LoadingButton>
                </div>
            </form>
        </AppLayout>
    );
}
