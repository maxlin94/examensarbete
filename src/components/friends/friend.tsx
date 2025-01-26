import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faMessage } from "@fortawesome/free-solid-svg-icons";
import { sendFriendRequest } from "@/actions/sendFriendRequest";
import { Tooltip } from 'react-tooltip';
import Image from 'next/image';
import 'react-tooltip/dist/react-tooltip.css';
import socket from "@/util/socket";
import useStore from "@/store";

type FriendProps = {
    user: UserDto;
}

export default function Friend({ user }: FriendProps) {
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const { setActivePage, setSelectedFriend, messages, fetchMessages } = useStore();

    const handleOpenChat = async (user: FriendType) => {
        if(messages.has(user.friendshipId)) {
            await fetchMessages(user.friendshipId);
        }
        setSelectedFriend(mapToFriendType(user));
        setActivePage('chat');
    }

    const mapToFriendType = (user: UserDto): FriendType => {
        return {
            id: user.id,
            name: user.name,
            friendshipId: user.friendshipId || '',
        }
    }

    const handleSendFriendRequest = async (id: string) => {
        try {
            await sendFriendRequest(id);
            setSentRequests((prev) => [...prev, id]);
            socket.emit('friendRequest', id);
        } catch (error) {
            console.error(error);
        }
    }

    const isRequestSent = sentRequests.includes(user.id);
    return (
        <div className="flex justify-between items-center w-full p-5 bg-slate-600 rounded-md gap-2">
            <div className="flex items-center gap-2">
                <Image src="/images/placeholder.png" alt="User avatar" width="40" height="40" className="rounded-full" />
                <span>{user.name}</span>
            </div>
            {user.isFriend ?
                <button onClick={() => handleOpenChat(mapToFriendType(user))} className="text-blue-500">
                    <FontAwesomeIcon icon={faMessage} />
                </button> :
                <button
                    disabled={user.isFriendRequestSent || isRequestSent}
                    onClick={() => handleSendFriendRequest(user.id)}
                    className={`${user.isFriendRequestSent || isRequestSent ? "text-gray-300" : "text-blue-500"}`}
                    data-tooltip-id={`tooltip-${user.id}`}
                    data-tooltip-content={isRequestSent || user.isFriendRequestSent ? 'Friend request already sent' : ''}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            }
            <Tooltip id={`tooltip-${user.id}`} />
        </div>
    )
}