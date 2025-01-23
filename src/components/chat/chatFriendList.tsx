import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type FriendListProps = {
    selectedFriend: UserDto | null;
    setSelectedFriend: React.Dispatch<React.SetStateAction<UserDto | null>>;
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export default function FriendList({ selectedFriend, setSelectedFriend, messages, setMessages }: FriendListProps) {
    const [friends, setFriends] = useState<UserDto[]>([]);
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


    useEffect(() => {
        if (!selectedFriend) return;
        setFriends((prevFriends) =>
            prevFriends.map((friend) => {
                if (friend.id === selectedFriend.id) {
                    const lastMessage = messages[messages.length - 1];
                    return {
                        ...friend,
                        lastMessage
                    };
                }
                return friend;
            })
        );
    }, [messages, selectedFriend]);

    return (
        <div className="flex flex-col w-1/4 border-2 border-slate-500 h-full rounded-md">
            {friends.map((friend: UserDto) => (
                <div
                    key={friend.id}
                    className={`p-2 text-lg cursor-pointer ${selectedFriend?.id === friend.id ? 'bg-slate-500' : ''}`}
                    onClick={() => {
                        if(friend.id !== selectedFriend?.id) setSelectedFriend(friend)}}
                >
                    {friend.name}
                    {friend.lastMessage &&
                        <div className="text-sm italic">
                            {friend.lastMessage.senderId === session?.data?.user.id ? "You: " : "Them: "}
                            {friend.lastMessage.content}
                        </div>}
                </div>
            ))}
        </div>
    )
}