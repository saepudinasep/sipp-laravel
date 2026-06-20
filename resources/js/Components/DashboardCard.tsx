interface Props {
    title: string;
    value: string | number;
}

export default function DashboardCard({ title, value }: Props) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">{title}</h3>

            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}
