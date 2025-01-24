import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/store';


export default function FriendList() {
    const { messages, selectedFriend, setSelectedFriend, friends, fetchFriends } = useStore();
    const session = useSession();

    useEffect(() => {
        fetchFriends();
        return () => {
            setSelectedFriend(null)
         }
    }, [fetchFriends, setSelectedFriend]);

    const getLastMessage = (id: string) => {
        const message = messages.get(id)?.slice(-1)[0] || friends.find(friend => friend.friendshipId === id)?.lastMessage
        if (!message) return
        return (
            message.senderId === session?.data?.user.id ? "You: " + message.content.slice(0, 20) : "Them: " + message.content.slice(0, 20)
        )
    }

    return (
        <div className="flex flex-col w-1/4 min-w-fit border-2 border-slate-500 h-full rounded-md gap-1">
            {friends.map((friend: UserDto) => (
                <div
                    key={friend.id}
                    className={`mx-1 mt-1 p-2 text-lg cursor-pointer text-wrap break-all rounded-md ${selectedFriend?.id === friend.id ? 'bg-slate-500' : 'bg-slate-800'}`}
                    onClick={() => {
                        if (friend.id !== selectedFriend?.id) setSelectedFriend(friend)
                    }}
                >
                    {friend.name.length > 20 ? friend.name.slice(0, 20) + "..." : friend.name}
                    {friend.friendshipId && getLastMessage(friend.friendshipId) &&
                        <div className="text-sm italic">
                            {friend.friendshipId && getLastMessage(friend.friendshipId)}
                        </div>}
                </div>
            ))}
        </div>
    )
}