import { useEffect, useRef, useState, useCallback } from 'react';
import ChatInput from '@/components/chat/chatInput';
import socket from '@/util/socket';
import { saveMessage } from '@/actions/saveMessage';
import { useSession } from 'next-auth/react';
import ScrollWrapper from '@/components/shared/scrollWrapper';

type ChatBoxProps = {
  selectedFriend: UserDto | null;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export default function ChatBox({ selectedFriend, messages, setMessages, }: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messagesCache, setMessagesCache] = useState<Map<string, MessageType[]>>(new Map());
  const session = useSession();

  useEffect(() => {
    const friendId = selectedFriend?.id;
    if (!selectedFriend || !friendId) return;
    socket.emit('joinRoom', selectedFriend.friendshipId);
    socket.on('privateMessage', (message: MessageType) => {
      updateMessages(message);
    });
    if (messagesCache.has(friendId)) {
      setMessages(messagesCache.get(friendId) || []);
    } else {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/${friendId}`);
          if (!response.ok) throw new Error('Failed to fetch messages');
          const data = await response.json();
          setMessagesCache((prevCache) => new Map(prevCache).set(friendId, data));
          setMessages(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
    }
    return () => {
      socket.off('privateMessage');
    };
  }, [selectedFriend]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    const messageObj = {
      content: message,
      friendshipId: selectedFriend?.friendshipId || '',
      receiverId: selectedFriend?.id || '',
      senderId: session.data?.user.id || ''
    };
    socket.emit('privateMessage', messageObj);
    await saveMessage(messageObj);
    updateMessages(messageObj);
  }

  const updateMessages = useCallback(
    (message: MessageType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessagesCache((prevCache) => {
        const friendId = selectedFriend?.id || '';
        const currentMessages = prevCache.get(friendId) || [];
        return new Map(prevCache).set(friendId, [...currentMessages, message]);
      });
    },
    [selectedFriend]
  );

  return (
    <div className="flex flex-col w-3/4 p-4 rounded-md">
      <ScrollWrapper>
        {messages.map((msg: MessageType, index) => (
          <div key={index} className={`m-2 relative rounded-md ${msg.senderId === session.data?.user.id ? 'text-right' : 'text-left'}`}>
            <span className="inline-block p-2 rounded-md bg-slate-800 break-all">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollWrapper>
      {selectedFriend && (
        <ChatInput sendMessage={sendMessage} />
      )}
    </div>
  )
}