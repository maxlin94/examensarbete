import { useEffect } from 'react';
import useStore from '@/store';
import Image from 'next/image';


export default function FriendList() {
    const { messages, selectedFriend, setSelectedFriend, friends, fetchFriends, fetchMessages } = useStore();

    useEffect(() => {
        const fetch = async () => {
            await fetchFriends();
        }
        fetch();
    }, [fetchFriends]);

    const handleFriendClick = async (friend: FriendType) => {
        setSelectedFriend(friend);
        if (!messages.has(friend.friendshipId)) {
            await fetchMessages(friend.friendshipId);
        }
    }

    const getLastMessage = (friend: FriendType) => {
        const message = messages.get(friend.friendshipId || '')?.slice(-1)[0] || friends.find((f) => f.id === friend.id)?.lastMessage
        if (!message) return
        return (
            <div className="text-sm italic">
                {message.senderId !== friend.id ? "You: " + message.content.slice(0, 20) : "Them: " + message.content.slice(0, 20)}
            </div>
        )
    }

    return (
        <div className="flex flex-col w-1/4 min-w-fit border-2 border-slate-500 h-full rounded-md gap-1">
            {friends.map((friend: FriendType) => (
                <div
                    key={friend.id}
                    className={`flex mx-1 mt-1 p-2 cursor-pointer rounded-md ${selectedFriend?.id !== friend.id ? 'bg-slate-500' : 'bg-slate-800'}`}
                    onClick={() => handleFriendClick(friend)}
                >
                    <div className="self-center mx-2">
                        <Image src="/images/placeholder.png" width="40" height="40" alt="User avatar" className="rounded-full" />
                    </div>
                    <div className="flex flex-col gap-1 text-wrap break-all text-lg">
                        {friend.name.length > 20 ? friend.name.slice(0, 20) + "..." : friend.name}
                        {getLastMessage(friend)}
                    </div>
                </div>
            ))}
        </div>
    )
}