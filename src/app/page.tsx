"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import FriendPanel from "@/components/friends/friendPanel";
import ChatPanel from "@/components/chat/chatPanel";

export default function Home() {
  const [activePage, setActivePage] = useState<"chat" | "friends">("chat");

  return (
    <div className="flex min-h-screen max-h-screen w-full relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="w-full flex flex-col items-center">
        {activePage === "chat" ? <ChatPanel /> : <FriendPanel />}
      </div>
    </div>
  )
}
