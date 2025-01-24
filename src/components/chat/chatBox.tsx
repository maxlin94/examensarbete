import { useEffect, useRef } from 'react';
import ChatInput from '@/components/chat/chatInput';
import socket from '@/util/socket';
import { useSession } from 'next-auth/react';
import ScrollWrapper from '@/components/shared/scrollWrapper';
import useStore from '@/store';

export default function ChatBox() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { selectedFriend, messages, addMessage, setMessages } = useStore();
  const session = useSession();

  useEffect(() => {
    const friendId = selectedFriend?.id;
    const fetchMessages = async () => {
      try {
        if (!selectedFriend?.friendshipId) return;
        const response = await fetch(`/api/messages/${friendId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(selectedFriend.friendshipId, data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [selectedFriend, setMessages]);

  useEffect(() => {
    if (selectedFriend) {
      socket.emit('joinRoom', selectedFriend.friendshipId);
      socket.on('privateMessage', (message: MessageType) => {
        addMessage(message);
      });
    }
    return () => {
      socket.off('privateMessage');
    };
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const currentMessages = messages.get(selectedFriend?.friendshipId || '') || [];

  return (
    <div className="flex flex-col w-3/4 p-4 rounded-md">
      <ScrollWrapper>
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
      </ScrollWrapper>
      {selectedFriend && (
        <ChatInput />
      )}
    </div>
  )
}