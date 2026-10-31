import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Dashboard" },
    { to: "/customers", label: "Customers" },
    { to: "/products", label: "Products" },
    { to: "/plans", label: "Plans" },
    { to: "/subscriptions", label: "Subscriptions" },
    { to: "/invoices", label: "Invoices" },
    { to: "/payments", label: "Payments" },
    { to: "/discounts", label: "Discounts" },
    { to: "/settings", label: "Settings" },
];

export function Sidebar() {
    return (
        <aside className="w-60 bg-white border-r border-gray-100 h-screen sticky top-0 hidden md:block">
            <div className="px-5 py-4 text-lg font-bold text-brand-700">Brightloop</div>
            <nav className="px-2 space-y-1">
                {links.map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.to === "/"}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {l.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}