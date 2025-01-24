import { useEffect } from 'react';
import ChatInput from '@/components/chat/chatInput';
import socket from '@/util/socket';
import ScrollWrapper from '@/components/shared/scrollWrapper';
import useStore from '@/store';
import ChatMessages from './chatMessages';

export default function ChatBox() {
  const { selectedFriend, addMessage, setMessages } = useStore();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedFriend?.friendshipId) return;
      try {
        const response = await fetch(`/api/messages/${selectedFriend.id}`);
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(selectedFriend.friendshipId, data);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedFriend) {
      fetchMessages();
      socket.emit("joinRoom", selectedFriend.friendshipId);
      socket.on("privateMessage", (message: MessageType) => {
        addMessage(message);
      });
    }

    return () => {
      socket.off("privateMessage");
    };
  }, [selectedFriend, setMessages, addMessage]);

  return (
    <div className="flex flex-col w-3/4 p-4 rounded-md">
      <ScrollWrapper>
        <ChatMessages />
      </ScrollWrapper>
      {selectedFriend && (
        <ChatInput />
      )}
    </div>
  )
}