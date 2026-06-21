import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="login-wrap">
                <div className="login-deco" />

                {/* Left side — branding */}
                <div className="login-left">
                    <div className="login-logo">
                        <div className="login-logo-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                            </svg>
                        </div>
                        <div className="login-logo-name">
                            Si<span>PP</span>
                        </div>
                    </div>

                    <div className="login-hero">
                        <h1>
                            Sistem Informasi
                            <br />
                            Pembayaran SPP
                        </h1>
                        <p>
                            Platform digital terintegrasi untuk pengelolaan
                            pembayaran SPP sekolah yang akurat, cepat, dan
                            transparan.
                        </p>
                    </div>

                    <div className="login-stats">
                        <div className="stat-item">
                            <div className="stat-num">3</div>
                            <div className="stat-label">Level Akses</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-num">100%</div>
                            <div className="stat-label">Tercatat Digital</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-num">Real-time</div>
                            <div className="stat-label">Status Pembayaran</div>
                        </div>
                    </div>
                </div>

                {/* Right side — form */}
                <div className="login-right">
                    <div className="login-card">
                        <h2>Selamat Datang</h2>
                        <p>Masuk ke Sistem Pembayaran SPP</p>

                        {status && (
                            <div
                                style={{
                                    marginBottom: 18,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    background: "rgba(16,185,129,.12)",
                                    border: "1px solid rgba(16,185,129,.25)",
                                    color: "#34d399",
                                    fontSize: 12,
                                }}
                            >
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="login-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="nama@sekolah.id"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="login-error"
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="login-error"
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 13,
                                        color: "rgba(255,255,255,.6)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                        style={{ width: 14, height: 14 }}
                                    />
                                    Ingat Saya
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        style={{
                                            fontSize: 13,
                                            color: "var(--blue2)",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Lupa Password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="login-btn"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                {processing && (
                                    <span
                                        style={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: "50%",
                                            border: "2px solid rgba(255,255,255,.35)",
                                            borderTopColor: "#fff",
                                            display: "inline-block",
                                            animation:
                                                "btn-spin 0.6s linear infinite",
                                        }}
                                    />
                                )}
                                {processing
                                    ? "Memproses..."
                                    : "Masuk ke Sistem →"}
                            </button>
                        </form>

                        <div className="login-back">
                            <Link href="/">← Kembali ke Landing Page</Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
