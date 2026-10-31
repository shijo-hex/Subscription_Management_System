import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Subscriptions() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("/subscriptions").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Subscriptions</h1>
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "customer_id", label: "Customer" }, { key: "plan_id", label: "Plan" }, { key: "status", label: "Status" }, { key: "renewal_date", label: "Renews" }]}
                    rows={rows} loading={loading} empty="No subscriptions yet."
                />
            </div>
        </div>
    );
}