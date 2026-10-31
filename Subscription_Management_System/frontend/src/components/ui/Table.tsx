interface Column { key: string; label: string }

export function Table({ columns, rows, loading, empty }: {
    columns: Column[]; rows: Record<string, any>[]; loading?: boolean; empty?: string;
}) {
    if (loading) return <div className="p-6 text-center text-gray-400">Loading…</div>;
    if (!rows.length) return <div className="p-6 text-center text-gray-400">{empty || "No data yet"}</div>;

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500 border-b">
                    {columns.map((c) => <th key={c.key} className="py-2 px-3">{c.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        {columns.map((c) => <td key={c.key} className="py-2 px-3">{row[c.key]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}