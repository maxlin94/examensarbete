import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Button from "./shared/customButton";
import { useState } from "react";
import Dropdown from "@/components/dropdown";
import useStore from "@/store";
import { useEffect } from "react";
import socket from "@/util/socket";
import { useSession } from "next-auth/react";

export default function Sidebar() {
    const { activePage, setActivePage, fetchFriendRequests, addMessage, selectedFriend } = useStore();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [friendRequestReceived, setFriendRequestReceived] = useState(false);
    const [messageReceived, setMessageReceived] = useState(false);
    const session = useSession();

    useEffect(() => {
        if (session.data?.user.id) {
            socket.emit('joinRoom', session.data?.user.id);
            socket.on('friendRequest', () => {
                setFriendRequestReceived(true);
                fetchFriendRequests();
            });
            socket.on('message', (message: MessageType) => {
                if (message.friendshipId !== selectedFriend?.friendshipId) {
                    setMessageReceived(true);
                    addMessage(message);
                }
            });
        }
        return () => {
            socket.off('friendRequest');
            socket.off('message');
        }
    }, [session, selectedFriend, addMessage, fetchFriendRequests]);


    return (
        <div className="flex h-screen bg-gray-800 w-40 min-w-40 relative">
            <div className="flex flex-col items-center h-full bg-gray-800 w-full gap-10 py-5">
                <button onClick={() => {
                    if (!dropdownVisible) {
                        setFriendRequestReceived(false);
                    }
                    setDropdownVisible(!dropdownVisible)
                }}
                    className={`flex-none self-center w-10 h-10 ${friendRequestReceived ? "text-red-500" : "text-white"} hover:cursor-pointer hover:text-blue-500`}>
                    <FontAwesomeIcon
                        className="w-10 h-10 text-blue"
                        icon={faBell} />
                </button>
                <button className={`${messageReceived ? "text-red-500" : activePage === "chat" ? "text-blue-500" : "text-white"} flex-none self-center w-10 h-10 hover:cursor-pointer hover:text-blue-500`}>
                    <FontAwesomeIcon
                        onClick={() => {
                            setActivePage("chat")
                            setMessageReceived(false);
                        }}
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
            <Dropdown dropdownVisible={dropdownVisible} />
        </div>
    )
}