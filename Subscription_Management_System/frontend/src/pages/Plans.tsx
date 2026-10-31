import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Plans() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("/plans").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Plans</h1>
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "billing_cycle", label: "Cycle" }, { key: "price", label: "Price" }]}
                    rows={rows} loading={loading} empty="No plans yet."
                />
            </div>
        </div>
    );
}