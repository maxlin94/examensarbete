import { useState } from "react"
import acceptFriendRequest from "@/actions/acceptFriendRequest"
import declineFriendRequest from "@/actions/declineFriendRequest"

export default function FriendRequest({ request }: { request: FriendRequestType }) {
    const [requestStatus, setRequestStatus] = useState(new Map())
    const handleAccept = async (id: string) => {
        try {
            await acceptFriendRequest(id);
            setRequestStatus((prevStatus) => {
                const newStatus = new Map(prevStatus);
                newStatus.set(id, "accepted");
                return newStatus;
            });
        } catch (error) {
            console.error(error);
        }
    };
    const handleDecline = async (id: string) => {
        try {
            await declineFriendRequest(id);
            setRequestStatus((prevStatus) => {
                const newStatus = new Map(prevStatus);
                newStatus.set(id, "declined");
                return newStatus;
            });
        } catch (error) {
            console.error(error);
        }
    };
    const frStatus = requestStatus.get(request.id);

    return (
        <>
            {frStatus &&
                <li className={`flex items-center justify-between bg-slate-700 rounded-md w-fit p-2 m-2 gap-2 text-wrap break-all`}>
                    <p>You {frStatus} {request.user.name}'s friend request</p>
                </li>
            }
            {!frStatus &&
                <li className={`flex items-center justify-between bg-slate-700 rounded-md p-2 m-2 gap-2 text-wrap break-all`}>
                    <p>{request.user.name} added you as a friend</p>
                    <div className="flex gap-2">
                        <button onClick={async () => await handleAccept(request.id)} className="bg-green-500 text-white p-1 rounded-md w-16">Accept</button>
                        <button onClick={async () => await handleDecline(request.id)} className="bg-red-500 text-white p-1 rounded-md w-16">Decline</button>
                    </div>
                </li>
            }
        </>
    )
}