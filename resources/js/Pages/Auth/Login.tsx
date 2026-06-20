import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
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

            <div className="flex min-h-screen">
                {/* Left Side */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900" />

                    <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                        <div className="mb-6">
                            <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm text-blue-300">
                                Sistem Pembayaran SPP Digital
                            </span>
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight">
                            Selamat Datang
                            <br />
                            di <span className="text-blue-400">SiPP</span>
                        </h1>

                        <p className="mt-6 max-w-lg text-slate-300">
                            Kelola pembayaran SPP sekolah dengan lebih cepat,
                            transparan, dan terintegrasi dalam satu sistem.
                        </p>

                        <div className="mt-12 grid grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-3xl font-bold text-white">
                                    1200+
                                </h3>
                                <p className="text-sm text-slate-400">Siswa</p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-white">
                                    28jt+
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Pembayaran
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-white">
                                    99%
                                </h3>
                                <p className="text-sm text-slate-400">Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex w-full items-center justify-center bg-slate-50 px-6 lg:w-1/2">
                    <div className="w-full max-w-md">
                        <div className="rounded-3xl bg-white p-8 shadow-xl">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-slate-900">
                                    Login
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Masuk ke Sistem Pembayaran SPP
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full rounded-xl"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-5">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />

                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full rounded-xl"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                        />

                                        <span className="ml-2 text-sm text-slate-600">
                                            Ingat Saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            Lupa Password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? "Memproses..." : "Masuk"}
                                </button>
                            </form>

                            <div className="mt-6 border-t pt-6 text-center">
                                <Link
                                    href="/"
                                    className="text-sm text-slate-500 hover:text-blue-600"
                                >
                                    ← Kembali ke Landing Page
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
