import React from 'react';
import { getUsers } from '@/actions/getUsers';
import Input from '@/components/shared/input';

type UserSearchBarProps = {
    setFriends: (_: UserDto[]) => void;
}

export default function UserSearchBar({ setFriends }: UserSearchBarProps) {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length < 2) {
            setFriends([]);
            return;
        };
        try {
            const users = await getUsers(e.target.value);
            setFriends(users);
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