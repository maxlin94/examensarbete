"use client";

import Sidebar from "@/components/sidebar/sidebar";
import FriendPanel from "@/components/friends/friendPanel";
import ChatPanel from "@/components/chat/chatPanel";
import useStore from "@/store";
import SocketProvider from "@/context/SocketProvider";

export default function Home() {
  const { activePage } = useStore();

  return (
    <SocketProvider>
      <div className="flex min-h-screen max-h-screen w-full relative">
        <Sidebar />
        <div className="w-full flex flex-col items-center">
          {activePage === "chat" ? <ChatPanel /> : <FriendPanel />}
        </div>
      </div>
    </SocketProvider>
  )
}
