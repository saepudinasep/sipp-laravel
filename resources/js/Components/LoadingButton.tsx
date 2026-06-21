import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    variant?: "primary" | "outline" | "danger";
    size?: "default" | "sm";
}

/**
 * Tombol dengan state loading bawaan (spinner + teks alternatif + disabled
 * otomatis). Dipakai untuk semua tombol submit/aksi di seluruh halaman
 * (Create, Edit, Delete, dll) agar perilaku loading konsisten.
 *
 * Contoh:
 *   <LoadingButton type="submit" loading={processing} loadingText="Menyimpan...">
 *       Simpan Data
 *   </LoadingButton>
 */
export default function LoadingButton({
    loading = false,
    loadingText,
    variant = "primary",
    size = "default",
    className = "",
    children,
    disabled,
    ...rest
}: Props) {
    const variantClass =
        variant === "primary"
            ? "btn-primary"
            : variant === "danger"
              ? "btn-danger"
              : "btn-outline";

    const sizeClass = size === "sm" ? "btn-sm" : "";

    const spinnerColor = variant === "outline" ? "var(--blue)" : "#fff";
    const spinnerTrack =
        variant === "outline" ? "rgba(30,111,232,.25)" : "rgba(255,255,255,.4)";

    return (
        <button
            {...rest}
            disabled={disabled || loading}
            className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
        >
            {loading && (
                <span
                    className="btn-spinner"
                    style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: `2px solid ${spinnerTrack}`,
                        borderTopColor: spinnerColor,
                        display: "inline-block",
                        animation: "btn-spin 0.6s linear infinite",
                        flexShrink: 0,
                    }}
                />
            )}
            {loading ? (loadingText ?? "Memproses...") : children}
        </button>
    );
}
