export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "staff" | "customer";
}

export interface DashboardSummary {
    totalCustomers: number;
    activeSubscriptions: number;
    totalInvoices: number;
    revenueCollected: number;
    outstandingPayments: number;
    overdueInvoices: number;
}