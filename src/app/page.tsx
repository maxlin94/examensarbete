"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [activePage, setActivePage] = useState<"chat" | "friends">("chat");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div className="flex min-h-screen w-full relative">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
      />
      {activePage === "chat" ? <div>Chat</div> : <div>Friends</div>}
      {dropdownVisible && <div className="absolute left-40 w-40 h-60 bg-gray-800 rounded-br-md">Dropdown</div>}
    </div>
  )
}
