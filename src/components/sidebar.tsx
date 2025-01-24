import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Button from "./shared/customButton";
import { useState } from "react";
import Dropdown from "@/components/dropdown";

type SidebarProps = {
    activePage: "chat" | "friends",
    setActivePage: (page: "chat" | "friends") => void,
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    return (
        <div className="flex h-screen bg-gray-800 w-40 min-w-40 relative">
            <div className="flex flex-col items-center h-full bg-gray-800 w-full gap-10 py-5">
                <button onClick={() => setDropdownVisible(!dropdownVisible)}
                    className={`flex-none self-center w-10 h-10 ${!dropdownVisible ? "text-red-500" : "text-white"} hover:cursor-pointer hover:text-blue-500`}>
                    <FontAwesomeIcon
                        className="w-10 h-10 text-blue"
                        icon={faBell} />
                </button>
                <button className={`${activePage === "chat" ? "text-blue-500" : "text-white"} flex-none self-center w-10 h-10 hover:cursor-pointer hover:text-blue-500`}>
                    <FontAwesomeIcon
                        onClick={() => setActivePage("chat")}
                        className="w-10 h-10"
                        icon={faMessage} />
                </button>
                <button className={`${activePage === "friends" ? "text-blue-500" : "text-white"} flex-none self-center w-10 h-10 hover:cursor-pointer hover:text-blue-500`}>
                    <FontAwesomeIcon
                        onClick={() => setActivePage("friends")}
                        className="w-10 h-10"
                        icon={faUserFriends} />
                </button>
                <Button onClick={() => signOut()} buttonType="logout" className="mt-auto">Logout</Button>
            </div>
            <Dropdown dropdownVisible={dropdownVisible}/>
        </div>
    )
}