import { useEffect, useState } from "react";
import client from "../api/client";
import { Table } from "../components/ui/Table";
import { useAuth } from "../context/AuthContext";

export default function Discounts() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        client.get("/discounts").then((r) => setRows(r.data)).finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Discounts</h1>
            {user?.role !== "admin" && (
                <p className="text-sm text-amber-600">Only Admins can create or edit discounts. Viewing only.</p>
            )}
            <div className="bg-white rounded-xl border">
                <Table
                    columns={[{ key: "id", label: "ID" }, { key: "code", label: "Code" }, { key: "percent_off", label: "% Off" }, { key: "active", label: "Active" }]}
                    rows={rows} loading={loading} empty="No discounts yet."
                />
            </div>
        </div>
    );
}