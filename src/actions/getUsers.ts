"use server";

import prisma from "@/util/prisma";
import { validateUser, getUsersByName, getFriendsByUserId } from "@/util/user";

export async function getUsers(name: string): Promise<FriendType[]> {
    if (!name || name.trim() === "") {
        throw new Error("Name cannot be blank");
    }

    const currentUser = await validateUser();

    if (!currentUser) {
        throw new Error("Unauthorized: You must be logged in");
    }

    try {
        const users = await getUsersByName(name, currentUser.id);
        const friendships = await getFriendsByUserId(currentUser.id);

        const friendMap = new Map(
            friendships.map((friendship) => [
                friendship.userId === currentUser.id ? friendship.friendId : friendship.userId,
                friendship.id,
            ])
        );

        const sanitized = await Promise.all(
            users.map(async (user) => {
                const friendshipId = friendMap.get(user.id);
                const isFriend = friendMap.has(user.id);

                const friendRequestExists = await prisma.friendRequest.findFirst({
                    where: {
                        senderId: currentUser.id,
                        receiverId: user.id,
                    },
                });
                const { name, id } = user;
                return {
                    name,
                    id,
                    isFriend,
                    friendshipId,
                    isFriendRequestSent: !!friendRequestExists,
                };
            })
        );

        return sanitized;
    } catch (e) {
        console.log(e);
        throw new Error("Internal server error");
    }
}
