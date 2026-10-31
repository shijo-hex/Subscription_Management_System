import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export default function Login() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch { }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
                <h1 className="text-xl font-bold text-brand-700 mb-6">Brightloop Admin</h1>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <label className="block text-sm mb-1">Email</label>
                <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
                />
                <label className="block text-sm mb-1">Password</label>
                <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-6 text-sm"
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </div>
    );
}