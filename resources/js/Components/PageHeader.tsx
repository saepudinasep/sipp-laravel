import { Link } from "@inertiajs/react";

interface Props {
    title: string;
    createUrl?: string;
}

export default function PageHeader({ title, createUrl }: Props) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>

            {createUrl && (
                <Link
                    href={createUrl}
                    className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                    Tambah Data
                </Link>
            )}
        </div>
    );
}
