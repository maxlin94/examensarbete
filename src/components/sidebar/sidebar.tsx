import { useState } from "react";
import Dropdown from "@/components/sidebar/dropdown";
import SidebarListItems from "@/components/sidebar/sidebarListItems";
import useStore from "@/store";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import socket from "@/util/socket";

export default function Sidebar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { fetchFriendRequests, addMessage, messages, setMessageReceived, fetchMessages } = useStore();
    const session = useSession();

    useEffect(() => {
        if(!session.data?.user) return;
        socket.emit('joinRoom', session.data?.user.id);
        socket.on('friendRequest', () => {
            fetchFriendRequests();
        });
        socket.on('privateMessage', async (message: MessageType) => {
            if (!messages.has(message.friendshipId)) {
                await fetchMessages(message.friendshipId);
            }
            addMessage(message);
            setMessageReceived(true);
        });
        return () => {
            socket.off('friendRequest');
            socket.off('privateMessage');
        }
    }, [session.data?.user.id, addMessage, fetchFriendRequests, fetchMessages, setMessageReceived]);


    return (
        <div className="flex h-screen bg-gray-800 w-40 min-w-40 relative">
            <div className="flex flex-col items-center h-full bg-gray-800 w-full gap-10 py-5">
                <SidebarListItems dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />
            </div>
            <Dropdown dropdownVisible={dropdownVisible} />
        </div>
    )
}