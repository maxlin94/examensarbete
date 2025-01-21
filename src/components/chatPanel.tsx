'use client';

import { useState, useEffect } from 'react';
import { saveMessage } from '@/actions/saveMessage';
import socket from '@/util/socket';

export default function ChatPanel() {
  const [input, setInput] = useState('');
  const [friends, setFriends] = useState<UserType[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<UserType>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await fetch('/api/user/friends');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
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
    const fetchMessages = async () => {
      await fetch(`/api/messages/${selectedFriend.friendshipId}`)
        .then((response) => response.json())
        .then(data => setMessages(data));
    }
    if (selectedFriend) {
      socket.emit('joinRoom', selectedFriend.friendshipId);
      socket.on('privateMessage', (message: MessageType) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      fetchMessages();
      return () => {
        socket.off('privateMessage');
      };
    }

  }, [selectedFriend]);

  const sendMessage = async () => {
    if (input.trim() && selectedFriend) {
      const message = {
        content: input,
        friendshipId: selectedFriend.friendshipId,
        receiverId: selectedFriend.id,
        senderId: socket.id,
      };
      socket.emit('privateMessage', message);
      await saveMessage(message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  return (
    <div className="flex w-5/6 bg-slate-600 m-auto rounded-md h-[95%]">
      <div className="flex flex-col w-1/4 border-2 border-slate-500 h-full rounded-md">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`p-2 cursor-pointer ${selectedFriend?.id === friend.id ? 'bg-slate-500' : ''}`}
            onClick={() => setSelectedFriend(friend)}
          >
            {friend.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col w-3/4 max-h-[90%] p-4 rounded-md">
        <div className="flex-grow rounded-md overflow-y-auto 
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:rounded-full 
        [&::-webkit-scrollbar-track]:bg-gray-400 
        [&::-webkit-scrollbar-thumb]:rounded-full 
        [&::-webkit-scrollbar-thumb]:bg-gray-800">
          {messages.map((msg: MessageType, index) => (
            <div key={index} className={`m-2 relative rounded-md ${msg.receiverId === selectedFriend.id ? 'text-right' : 'text-left'}`}>
              <span className="inline-block p-2 rounded-md bg-slate-800 break-all">{msg.content}</span>
            </div>
          ))}
        </div>
        {selectedFriend && (
          <div className="mt-4 flex">
            <input
              type="text"
              className="flex-grow p-2 text-black rounded-l-md"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-r-md"
              onClick={sendMessage}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}