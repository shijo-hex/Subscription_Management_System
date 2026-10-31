import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";

export default function Products() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get("/products").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "description", label: "Description" }]}
                    rows={rows} loading={loading} empty="No products yet."
                />
            </div>
        </div>
    );
}