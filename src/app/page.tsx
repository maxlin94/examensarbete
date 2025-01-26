"use client";

import Sidebar from "@/components/sidebar/sidebar";
import FriendPanel from "@/components/friends/friendPanel";
import ChatPanel from "@/components/chat/chatPanel";
import useStore from "@/store";

export default function Home() {
  const { activePage } = useStore();

  return (
    <div className="flex min-h-screen max-h-screen w-full relative">
      <Sidebar />
      <div className="w-full flex flex-col items-center">
        {activePage === "chat" ? <ChatPanel /> : <FriendPanel />}
      </div>
    </div>
  )
}
