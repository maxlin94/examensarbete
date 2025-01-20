import React from 'react';
import { getUsers } from '@/actions/getUsers';

export default function UserSearchBar({ setFriends }: { setFriends: (_: UserType[]) => void }) {

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length < 2) {
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
            <input
                onChange={(e) => handleChange(e)}
                className="px-2 w-60 h-10 bg-gray-800 text-white border-b-2 border-gray-600 rounded-md"
                type="text"
                placeholder="Search for people"
            />
        </div>
    )
}