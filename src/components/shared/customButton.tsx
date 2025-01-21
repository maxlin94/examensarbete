import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonType = "signup" | "logout" | "decline" | "accept";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonType: ButtonType;
};

const types = {
    "signup": "signup-button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition",
    "logout": "logout-button bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition",
    "decline": "bg-red-500 hover:bg-red-600 text-white p-1 rounded-md w-16",
    "accept": "bg-green-500 hover:bg-green-600 text-white p-1 rounded-md w-16",
}

export default function Button({ buttonType, children, className, ...props }: ButtonProps) {
    return (
        <button className={twMerge(clsx(types[buttonType], className))} {...props}>{children}</button>
    )
}
