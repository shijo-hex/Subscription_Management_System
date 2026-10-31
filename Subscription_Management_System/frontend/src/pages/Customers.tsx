import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Customers() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        client.get("/customers").then((r) => setRows(r.data))
            .catch(() => setError("Could not load customers."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Customers</h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[
                        { key: "id", label: "ID" }, { key: "name", label: "Name" },
                        { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
                    ]}
                    rows={rows} loading={loading} empty="No customers yet."
                />
            </div>
        </div>
    );
}