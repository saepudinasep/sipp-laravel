import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Siswa {
    id: number;
    nama: string;
    nis: string;
    kelas_id: number;
    alamat: string | null;
    telp: string | null;
    user: {
        email: string;
    } | null;
}

interface Props {
    siswa: Siswa;
    kelasList: Kelas[];
}

export default function Edit({ siswa, kelasList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: siswa.nama ?? "",
        nis: siswa.nis ?? "",
        kelas_id: String(siswa.kelas_id ?? ""),
        alamat: siswa.alamat ?? "",
        telp: siswa.telp ?? "",
        email: siswa.user?.email ?? "",
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("admin.siswa.update", siswa.id));
    };

    return (
        <AppLayout title="Edit Siswa">
            <Head title="Edit Siswa" />

            <div className="breadcrumb">
                <Link href={route("admin.siswa.index")}>Data Siswa</Link> ·{" "}
                <span>Edit Siswa</span>
            </div>
            <div className="page-header">
                <h1>Edit Data Siswa</h1>
                <p>Perbarui data {siswa.nama}.</p>
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
                            <div className="form-group">
                                <label className="form-label">
                                    Email <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
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
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <div className="form-hint">
                                    Minimal 6 karakter. Biarkan kosong untuk
                                    mempertahankan password lama.
                                </div>
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
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary"
                    >
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
