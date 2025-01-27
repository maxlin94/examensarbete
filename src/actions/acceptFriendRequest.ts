"use server";

import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export default async function acceptFriendRequest(id: string) {
    try {
        const user = await validateUser();
        if (!user) {
            throw new Error("User not found.");
        }

        const friendRequest = await prisma.friendRequest.findUnique({
            where: {
                id: id,
            },
        });

        if (!friendRequest) {
            throw new Error("Friend request not found.");
        }

        if (friendRequest.receiverId !== user?.id) {
            throw new Error("You are not authorized to accept this friend request.");
        }

        await prisma.friendship.create({
            data: {
                userId: user.id,
                friendId: friendRequest.senderId,
            },
        });

        await prisma.friendRequest.deleteMany({
            where: {
                OR: [
                    {
                        senderId: friendRequest.senderId,
                        receiverId: friendRequest.receiverId,
                    },
                    {
                        senderId: friendRequest.receiverId,
                        receiverId: friendRequest.senderId,
                    },
                ]
            },
        });
    } catch (error) {
        console.log(error);
    }
}
