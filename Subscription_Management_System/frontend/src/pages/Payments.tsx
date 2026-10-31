import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Payments() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("/payments").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Payments</h1>
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "invoice_id", label: "Invoice" }, { key: "amount", label: "Amount" }, { key: "method", label: "Method" }, { key: "status", label: "Status" }]}
                    rows={rows} loading={loading} empty="No payments yet."
                />
            </div>
        </div>
    );
}