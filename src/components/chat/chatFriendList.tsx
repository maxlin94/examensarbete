import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useStore from '@/store';


export default function FriendList() {
    const [friends, setFriends] = useState<UserDto[]>([]);
    const { messages, selectedFriend, setSelectedFriend } = useStore();
    const session = useSession();


    useEffect(() => {
        async function fetchFriends() {
            try {
                const response = await fetch('/api/friends');
                if (!response.ok) {
                    throw new Error("Error fetching friends");
                }
                const data = await response.json();
                setFriends(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchFriends();
    }, []);

    const fetchLastMessage = (id: string) => {
        const message = messages.get(id)?.slice(-1)[0] || friends.find(friend => friend.friendshipId === id)?.lastMessage
        if (!message) return
        return (
            message.senderId === session?.data?.user.id ? "You: " + message.content.slice(0, 20) : "Them: " + message.content.slice(0, 20)
        )
    }

    return (
        <div className="flex flex-col w-1/4 min-w-fit border-2 border-slate-500 h-full rounded-md">
            {friends.map((friend: UserDto) => (
                <div
                    key={friend.id}
                    className={`p-2 text-lg cursor-pointer text-wrap break-all ${selectedFriend?.id === friend.id ? 'bg-slate-500' : ''}`}
                    onClick={() => {
                        if (friend.id !== selectedFriend?.id) setSelectedFriend(friend)
                    }}
                >
                    {friend.name.length > 20 ? friend.name.slice(0, 20) + "..." : friend.name}
                    {friend.lastMessage &&
                        <div className="text-sm italic">
                            {friend.friendshipId && fetchLastMessage(friend.friendshipId)}
                        </div>}
                </div>
            ))}
        </div>
    )
}