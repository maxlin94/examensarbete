import { useState } from "react";
import Dropdown from "@/components/sidebar/dropdown";
import SidebarListItems from "@/components/sidebar/sidebarListItems";

export default function Sidebar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    return (
        <div className="flex h-screen bg-gray-800 w-40 min-w-40 relative">
            <div className="flex flex-col items-center h-full bg-gray-800 w-full gap-10 py-5">
                <SidebarListItems dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />
            </div>
            <Dropdown dropdownVisible={dropdownVisible} />
        </div>
    )
}