import { Link } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links?: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    /** Satuan item yang ditampilkan, contoh: "siswa", "jenis SPP". Default "data". */
    itemLabel?: string;
}

export default function Pagination({
    links,
    from,
    to,
    total,
    itemLabel = "data",
}: Props) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="pagination">
            <span>
                {from && to && total
                    ? `Menampilkan ${from}–${to} dari ${total} ${itemLabel}`
                    : ""}
            </span>

            <div className="page-btns">
                {links.map((link, i) => {
                    let label = link.label;

                    if (label.includes("Previous")) {
                        label = "←";
                    } else if (label.includes("Next")) {
                        label = "→";
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url ?? "#"}
                            className={
                                "page-btn" +
                                (link.active ? " active" : "") +
                                (!link.url ? " disabled" : "")
                            }
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
