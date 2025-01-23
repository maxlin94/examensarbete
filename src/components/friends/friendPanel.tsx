"use client";

import { useState } from "react";
import UserSearchBar from "./userSearchBar"
import Friend from "@/components/friends/friend"

export default function FriendPanel() {
    const [friends, setFriends] = useState<UserDto[] | []>([]);
    return (
        <div>
            <UserSearchBar setFriends={setFriends} />
            <div className="flex flex-col gap-2">
                {friends.length > 0 && friends.map((friend) => (
                    <Friend key={friend.id} user={friend} />
                ))}
            </div>
        </div>
    )
}