import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faMessage } from "@fortawesome/free-solid-svg-icons";
import { sendFriendRequest } from "@/actions/sendFriendRequest";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type FriendProps = {
    user: UserType;
}

export default function Friend({ user }: FriendProps) {
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const handleClick = async (id: string) => {
        try {
            await sendFriendRequest(id);
            setSentRequests((prev) => [...prev, id]);
        } catch (error) {
            console.error(error);
        }
    }

    const isRequestSent = sentRequests.includes(user.id);
    return (
        <div className="flex justify-evenly items-center w-full p-5">
            <img src="/images/placeholder.png" className="w-10 h-10 rounded-full" />
            <p>{user.name}</p>
            {user.isFriend ?
                <button className="text-blue-500">
                    <FontAwesomeIcon icon={faMessage} />
                </button> :
                <button
                    disabled={user.friendRequestSent || isRequestSent}
                    onClick={() => handleClick(user.id)}
                    className={`${user.friendRequestSent || isRequestSent ? "text-gray-300" : "text-blue-500"}`}
                    data-tooltip-id={`tooltip-${user.id}`}
                    data-tooltip-content={isRequestSent || user.friendRequestSent ? 'Friend request already sent' : ''}>
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            }
            <Tooltip id={`tooltip-${user.id}`} />
        </div>
    )
}