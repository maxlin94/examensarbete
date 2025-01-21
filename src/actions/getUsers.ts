"use server";

import prisma from "@/lib/prisma";
import { sanitizeUser, validateUser, getUsersByName, getFriendsByUserId } from "@/util/userUtil";

export async function getUsers(name: string) {
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

        const friendSet = new Set(
            friendships.map((friendship) =>
                friendship.userId === currentUser.id ? friendship.friendId : friendship.userId
            )
        );

        const sanitized = await Promise.all(
            users.map(async (user) => {
                const isFriend = friendSet.has(user.id);

                const friendRequestExists = await prisma.friendRequest.findFirst({
                    where: {
                        senderId: currentUser.id,
                        receiverId: user.id,
                    },
                });

                return {
                    ...await sanitizeUser(user),
                    isFriend,
                    friendRequestSent: !!friendRequestExists,
                };
            })
        );

        return sanitized;
    } catch (e) {
        throw new Error("Internal server error");
    }
}
