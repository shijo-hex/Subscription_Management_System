import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Invoices() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("/invoices").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Invoices</h1>
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "customer_id", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }, { key: "due_date", label: "Due" }]}
                    rows={rows} loading={loading} empty="No invoices yet."
                />
            </div>
        </div>
    );
}