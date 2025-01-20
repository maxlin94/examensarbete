"use client";

import { useState } from "react";
import UserSearchBar from "./userSearchBar"
import Friend from "@/components/friend"

export default function FriendPanel() {
    const [friends, setFriends] = useState<UserType[]>([]);
    return (
        <div>
            <UserSearchBar setFriends={setFriends}/>
            {friends.length > 0 && friends.map((friend) => (
                <Friend key={friend.id} user={friend}/>
            ))}
        </div>
    )
}