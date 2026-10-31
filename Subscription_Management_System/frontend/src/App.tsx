import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Plans from "./pages/Plans";
import Subscriptions from "./pages/Subscriptions";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Discounts from "./pages/Discounts";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function Protected({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/customers" element={<Protected><Customers /></Protected>} />
            <Route path="/products" element={<Protected><Products /></Protected>} />
            <Route path="/plans" element={<Protected><Plans /></Protected>} />
            <Route path="/subscriptions" element={<Protected><Subscriptions /></Protected>} />
            <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
            <Route path="/payments" element={<Protected><Payments /></Protected>} />
            <Route path="/discounts" element={<Protected><Discounts /></Protected>} />
            <Route path="/settings" element={<Protected><Settings /></Protected>} />
        </Routes>
    );
}