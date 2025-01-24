import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ScrollWrapper from "@/components/shared/scrollWrapper";
import FriendRequest from "@/components/friends/friendRequest";
import socket from "@/util/socket";

type DropdownProps = {
    dropdownVisible: boolean
}

export default function Dropdown({ dropdownVisible }: DropdownProps) {
    const [friendRequests, setFriendRequests] = useState<FriendRequestType[]>([]);
    const [requestStatus, setRequestStatus] = useState(new Map())
    const [shouldFetch, setShouldFetch] = useState(true);
    const session = useSession();

    useEffect(() => {
        socket.emit('joinRoom', session.data?.user.id);
        socket.on('friendRequest', () => {
            setShouldFetch(true);
        });
        return () => {
            socket.off('friendRequest');
            socket.off('joinRoom');
        }
    }, [session]);

    useEffect(() => {
        if (!shouldFetch) return;
        async function fetchFriendRequests() {
            try {
                const response = await fetch('/api/friendRequest/incoming');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setFriendRequests(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchFriendRequests();
        setShouldFetch(false);
    }, [shouldFetch]);

    return (
        <ScrollWrapper className={`${dropdownVisible ? "" : "hidden"} absolute z-20 left-40 w-[350px] min-h-[300px] max-h-96 bg-gray-800 border-l-2 border-slate-500 rounded-br-md gap-2`}>
            {friendRequests.length > 0 ? [...friendRequests].reverse().map((request, index) => (
                <FriendRequest
                    key={index}
                    request={request}
                    requestStatus={requestStatus}
                    setRequestStatus={setRequestStatus} />
            )) : <li className="text-white p-2 text-center list-none">No notifications</li>}
        </ScrollWrapper>
    )
}