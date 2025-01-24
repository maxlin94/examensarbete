import useStore from '@/store';
import { useSession } from 'next-auth/react';
import { useRef, useEffect, useMemo } from 'react';

export default function ChatMessages() {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { messages, selectedFriend } = useStore();
    const session = useSession();
    
    const currentMessages = useMemo(() => {
        return messages.get(selectedFriend?.friendshipId || '') || [];
    }, [messages, selectedFriend]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [currentMessages]);

    return (
        <>
            {currentMessages.map((msg: MessageType, index) => (
                <div
                    key={index}
                    className={`m-2 relative rounded-md ${msg.senderId === session.data?.user.id ? 'text-right' : 'text-left'
                        }`}
                >
                    <span className="inline-block p-2 rounded-md bg-slate-800 break-all">{msg.content}</span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </>
    )
}