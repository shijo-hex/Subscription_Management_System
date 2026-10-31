import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export function Header() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 sticky top-0 z-10">
            <div className="relative">
                <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                        {user?.name?.[0]?.toUpperCase() || "A"}
                    </span>
                    {user?.name} <span className="text-gray-400 text-xs">({user?.role})</span>
                </button>
                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}