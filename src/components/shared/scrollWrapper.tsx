import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { ReactNode } from "react";

export default function ScrollWrapper({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={twMerge(clsx(`flex-grow overflow-y-auto 
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:rounded-full 
        [&::-webkit-scrollbar-track]:bg-gray-400 
        [&::-webkit-scrollbar-thumb]:rounded-full 
        [&::-webkit-scrollbar-thumb]:bg-gray-800`, className))}>
            {children}
        </div>
    )
}