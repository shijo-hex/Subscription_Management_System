import { useEffect, useState } from "react";
import client from "../api/client";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { DashboardSummary } from "../types";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from "recharts";

export default function Dashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [revenue, setRevenue] = useState<any[]>([]);
    const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            client.get("/dashboard/summary"),
            client.get("/dashboard/monthly-revenue"),
            client.get("/dashboard/recent-invoices"),
        ])
            .then(([s, r, i]) => {
                setSummary(s.data);
                setRevenue(r.data);
                setRecentInvoices(i.data);
            })
            .catch(() => setError("Could not load dashboard data from the backend."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-gray-400">Loading dashboard…</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const statusData = [
        { name: "Active", value: summary?.activeSubscriptions || 0 },
        { name: "Other", value: Math.max((summary?.totalInvoices || 0) - (summary?.activeSubscriptions || 0), 0) },
    ];
    const COLORS = ["#4f46e5", "#e5e7eb"];

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card title="Customers" value={summary?.totalCustomers ?? 0} />
                <Card title="Active Subscriptions" value={summary?.activeSubscriptions ?? 0} />
                <Card title="Invoices" value={summary?.totalInvoices ?? 0} />
                <Card title="Revenue Collected" value={`₹${summary?.revenueCollected ?? 0}`} />
                <Card title="Outstanding" value={`₹${summary?.outstandingPayments ?? 0}`} />
                <Card title="Overdue Invoices" value={summary?.overdueInvoices ?? 0} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border p-5">
                    <h2 className="text-sm font-medium mb-3">Monthly Revenue</h2>
                    {revenue.length ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={revenue}>
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-400 text-sm">No paid invoices yet.</p>}
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h2 className="text-sm font-medium mb-3">Subscription Status</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80}>
                                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl border">
                <h2 className="text-sm font-medium p-4 border-b">Recent Invoices</h2>
                <Table
                    columns={[
                        { key: "id", label: "ID" }, { key: "customer_id", label: "Customer" },
                        { key: "amount", label: "Amount" }, { key: "status", label: "Status" }, { key: "due_date", label: "Due" },
                    ]}
                    rows={recentInvoices}
                    empty="No invoices yet."
                />
            </div>
        </div>
    );
}