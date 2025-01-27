import acceptFriendRequest from "@/actions/acceptFriendRequest"
import declineFriendRequest from "@/actions/declineFriendRequest"
import Button from "@/components/shared/customButton"
import useStore from "@/store"
import { Dispatch, SetStateAction } from "react";

type FriendRequestProps = {
    request: FriendRequestType
    requestStatus: Map<string, string>
    setRequestStatus: Dispatch<SetStateAction<Map<string, string>>>
}

export default function FriendRequest({ request, requestStatus, setRequestStatus }: FriendRequestProps) {
    const { fetchFriends } = useStore();

    const handleStatusChange = async (id: string, status: string, action: () => Promise<void>) => {
        try {
            await action();
            setRequestStatus((prevStatus) => {
                const newStatus = new Map(prevStatus);
                newStatus.set(id, status);
                return newStatus;
            });
            if (status === "accepted") {
                await fetchFriends();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const frStatus = requestStatus.get(request.id);

    return (
        <>
            {frStatus && request.user &&
                <li className="list-none flex m-auto items-center justify-between bg-slate-700 rounded-md my-2 w-fit p-2 gap-2 text-wrap">
                    <p>You {`${frStatus} ${request.user.name}'s`} friend request</p>
                </li>}
            {!frStatus && request.user &&
                <li className={`flex items-center justify-between bg-slate-700 rounded-md p-2 m-2 gap-2 text-wrap`}>
                    <div>
                        <p className="break-all inline">{request.user.name}</p>
                        <span> added you as a friend</span>
                    </div>
                    <div className="flex gap-2">
                        <Button buttonType="accept" onClick={() => handleStatusChange(request.id, "accepted", () => acceptFriendRequest(request.id))}>Accept</Button>
                        <Button buttonType="decline" onClick={() => handleStatusChange(request.id, "declined", () => declineFriendRequest(request.id))}>Decline</Button>
                    </div>
                </li>}
        </>
    )
}