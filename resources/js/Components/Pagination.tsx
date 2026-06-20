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
}

export default function Pagination({ links, from, to, total }: Props) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="pagination">
            <span>
                {from && to && total
                    ? `Menampilkan ${from}–${to} dari ${total} data`
                    : ""}
            </span>

            <div className="page-btns">
                {links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url ?? "#"}
                        className={
                            "page-btn" +
                            (link.active ? " active" : "") +
                            (!link.url ? " disabled" : "")
                        }
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
