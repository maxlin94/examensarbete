import React from "react";

type ButtonType = "accept" | "decline" | "signup"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonType: ButtonType;
};

const types = {
    "accept": "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600",
    "decline": "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600",
    "signup": "signup-button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
}

export default function Button({ buttonType, children, ...props }: ButtonProps) {
    return (
        <button className={types[buttonType]} {...props}>{children}</button>
    )
}
