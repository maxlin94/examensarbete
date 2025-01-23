"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import FriendPanel from "@/components/friends/friendPanel";
import FriendRequest from "@/components/friends/friendRequest";
import ChatPanel from "@/components/chat/chatPanel";

export default function Home() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [activePage, setActivePage] = useState<"chat" | "friends">("chat");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    async function fetchFriendRequests() {
      try {
        const response = await fetch('/api/friendRequest/incoming');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setFriendRequests(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchFriendRequests();
  }, [dropdownVisible]);

  return (
    <div className="flex min-h-screen max-h-screen w-full relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />
      <div className="w-full flex flex-col items-center">
        {activePage === "chat" ? <ChatPanel/> : <FriendPanel />}
        {dropdownVisible && <ul className="absolute left-40 w-[350px] min-h-[300px] max-h-screen bg-gray-800 rounded-br-md">
          {friendRequests.length > 0 ? friendRequests.map((request, index) => (
            <FriendRequest key={index} request={request}/>
          )) : <li className="text-white p-2 text-center">No notifications</li>}

        </ul>}
      </div>
    </div>
  )
}
