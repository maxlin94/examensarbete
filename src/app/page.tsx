"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import FriendPanel from "@/components/friendPanel";
import FriendRequest from "@/components/friendRequest";

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
      } catch (error: any) {
        console.log(error);
      }
    }
    fetchFriendRequests();
  }, [dropdownVisible]);

  return (
    <div className="flex min-h-screen w-full relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />
      <div className="w-full flex flex-col items-center">
        {activePage === "chat" ? <div>Chat</div> : <FriendPanel />}
        {dropdownVisible && <ul className="absolute left-40 w-[350px] h-[400px] bg-gray-800 rounded-br-md">
          {friendRequests.length > 0 && friendRequests.map((request: FriendRequestType, index) => (
            <FriendRequest key={index} request={request}/>
          ))}
        </ul>}
      </div>
    </div>
  )
}
