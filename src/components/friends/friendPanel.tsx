"use client";

import { useState } from "react";
import UserSearchBar from "./userSearchBar"
import Friend from "@/components/friends/friend"

export default function FriendPanel() {
    const [users, setUsers] = useState<FriendType[] | []>([]);
    return (
        <div>
            <UserSearchBar setUsers={setUsers} />
            <div className="flex flex-col gap-2">
                {users.length > 0 && users.map((user) => (
                    <Friend key={user.id} user={user} />
                ))}
            </div>
        </div>
    )
}