"use server";

import { validateUser, getUsersByName } from "@/util/user";

export async function getUsers(name: string): Promise<UserWithRelations[]> {
    if (!name?.trim()) {
        throw new Error("Name cannot be blank");
    }

    const currentUser = await validateUser();

    if (!currentUser) {
        throw new Error("Unauthorized: You must be logged in");
    }

    try {
        const users: UserWithRelations[] = await getUsersByName(name, currentUser.id);
        return users.map((user: UserWithRelations) => {
            const friendships = [...user.friends || [], ...user.asFriend || []];
            const isRequestSent = user.receivedRequests?.some(
                (request) => request.senderId === currentUser.id
            );
            const isFriend = friendships.some((friendship) => 
                friendship.userId === currentUser.id || friendship.friendId === currentUser.id);
            const friendshipId = friendships.find((friendship) => 
                friendship.userId === currentUser.id || friendship.friendId === currentUser.id)?.id;
            return {
                id: user.id,
                name: user.name,
                friendshipId,
                isFriendRequestSent: isRequestSent,
                isFriend
            };
        });
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error");
    }
}
