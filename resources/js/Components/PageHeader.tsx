import { Link } from "@inertiajs/react";

interface Props {
    title: string;
    subtitle?: string;
    createUrl?: string;
    createLabel?: string;
}

export default function PageHeader({
    title,
    subtitle,
    createUrl,
    createLabel = "Tambah Data",
}: Props) {
    return (
        <div
            className="page-header"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
            }}
        >
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>

            {createUrl && (
                <Link href={createUrl} className="btn btn-primary">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="white"
                    >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    {createLabel}
                </Link>
            )}
        </div>
    );
}
