import React from "react";
import ErrorMessage from "@/components/shared/errorMessage";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string;
}

export default function Input({
                                  errorMessage,
                                  ...props
                              }: InputProps) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <input
                className={`px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400`}
                {...props}
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
    );
}