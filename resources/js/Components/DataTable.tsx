interface Props {
    columns: string[];
    children: React.ReactNode;
}

export default function DataTable({ columns, children }: Props) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3 text-left">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>{children}</tbody>
            </table>
        </div>
    );
}
