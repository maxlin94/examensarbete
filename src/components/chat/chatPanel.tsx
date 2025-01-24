'use client';

import { useState } from 'react';
import FriendList from '@/components/chat/chatFriendList';
import ChatBox from '@/components/chat/chatBox';

export default function ChatPanel() {
  const [selectedFriend, setSelectedFriend] = useState<UserDto | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <div className="flex w-11/12 bg-slate-600 m-auto rounded-md h-[95%]">
      <FriendList
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
        messages={messages}
        setMessages={setMessages}
        />
      <ChatBox
        messages={messages}
        setMessages={setMessages}
        selectedFriend={selectedFriend} />
    </div>
  );
}