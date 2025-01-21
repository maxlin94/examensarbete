import acceptFriendRequest from "@/actions/acceptFriendRequest"

export default function FriendRequest({ request }: { request: FriendRequestType }) {
    return (
        <li className="flex items-center justify-between bg-slate-600 rounded-md p-2 m-2 gap-2 max-w-[100%] text-wrap break-all">
            <p>{request.user.name} added you as a friend</p>
            <div className="flex gap-2">
                <button onClick={() => acceptFriendRequest(request.id)} className="bg-green-500 text-white p-1 rounded-md w-16">Accept</button>
                <button className="bg-red-500 text-white p-1 rounded-md w-16">Decline</button>
            </div>
        </li>
    )
}