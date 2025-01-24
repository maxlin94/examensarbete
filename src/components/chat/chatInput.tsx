import { useState } from 'react';
import useStore from '@/store';
import socket from '@/util/socket';
import { saveMessage } from '@/actions/saveMessage';
import { useSession } from 'next-auth/react';

export default function ChatInput() {
    const [input, setInput] = useState('');
    const [messageLoading, setMessageLoading] = useState(false);
    const { selectedFriend, addMessage } = useStore();
    const session = useSession();

    const sendMessage = async (message: string) => {
        if(!message.trim()) return;
        setMessageLoading(true);
        const messageObj = {
            content: message,
            friendshipId: selectedFriend?.friendshipId || '',
            receiverId: selectedFriend?.id || '',
            senderId: session.data?.user.id || ''
        };
        socket.emit('privateMessage', messageObj);
        socket.emit('message', { id: selectedFriend?.id, ...messageObj });
        await saveMessage(messageObj);
        addMessage(messageObj);
        setInput('');
        setMessageLoading(false);
    }

    return (
        <div className="mt-4 flex">
            <input
                type="text"
                className="flex-grow p-2 text-black rounded-l-md"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !messageLoading) sendMessage(input);
                }}
            />
            <button
                disabled={messageLoading}
                className={`p-2 bg-blue-500 text-white rounded-r-md ${messageLoading && 'opacity-50'}`}
                onClick={() => sendMessage(input)}>
                Send
            </button>
        </div>
    )
}