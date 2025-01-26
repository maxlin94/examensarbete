import React from 'react';
import { getUsers } from '@/actions/getUsers';
import Input from '@/components/shared/input';

type UserSearchBarProps = {
    setUsers: (_: FriendType[]) => void;
}

export default function UserSearchBar({ setUsers }: UserSearchBarProps) {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length < 2) {
            setUsers([]);
            return;
        };
        try {
            const users = (await getUsers(e.target.value)).map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    friendshipId: user.friendshipId || '',
                    isFriendRequestSent: user.isFriendRequestSent,
                    isFriend: user.isFriend,
                }
            });
            setUsers(users);
        } catch (e) {
            console.error('Error fetching users:', e);
        }
    }
    return (
        <div className="flex flex-col items-center w-full p-5">
            <Input
                onChange={(e) => handleChange(e)}
                type="text"
                placeholder="Search for people"
            />
        </div>
    )
}