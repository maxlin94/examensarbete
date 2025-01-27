import { useEffect } from 'react';
import useStore from '@/store';
import socket from '@/util/socket';
import { useSession } from 'next-auth/react';

export default function SocketProvider ({ children }: { children: React.ReactNode}) {
    const { messages, selectedFriend, addMessage, setMessageReceived, fetchFriendRequests, fetchMessages } = useStore();
    const session = useSession();

    useEffect(() => {
        if (!session.data?.user) return;
        socket.emit('joinRoom', session.data?.user.id);
    }, [session.data?.user]);

    useEffect(() => {
        socket.on('privateMessage', async (message: MessageType) => {
            if (!messages.has(message.friendshipId)) {
                await fetchMessages(message.friendshipId);
            }
            addMessage(message);
            if(selectedFriend?.id !== message.senderId) {
                setMessageReceived(true);
            }
        });
        socket.on('friendRequest', () => {
            fetchFriendRequests();
        });
        return () => {
            socket.off('friendRequest');
            socket.off('privateMessage');
        }
    }, [messages, selectedFriend, addMessage, setMessageReceived, fetchFriendRequests, fetchMessages]);
    
    return <>{children}</>;
};