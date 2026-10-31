import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Settings</h1>
            {!isAdmin && (
                <p className="text-sm text-amber-600">Only Admins can configure taxes and administrative settings.</p>
            )}
            <div className="bg-white rounded-xl border p-5 space-y-3">
                <p className="text-sm text-gray-500">Account</p>
                <p className="text-sm">{user?.name} — {user?.email} ({user?.role})</p>
            </div>
            <div className="bg-white rounded-xl border p-5">
                <p className="text-sm text-gray-500">Tax configuration — not implemented yet (Stage 2).</p>
            </div>
        </div>
    );
}