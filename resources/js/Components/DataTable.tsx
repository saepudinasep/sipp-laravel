interface Props {
    columns: string[];
    children: React.ReactNode;
}

export default function DataTable({ columns, children }: Props) {
    return (
        <div className="card">
            <div className="table-wrap">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>{children}</tbody>
                </table>
            </div>
        </div>
    );
}
