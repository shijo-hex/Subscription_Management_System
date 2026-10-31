import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}