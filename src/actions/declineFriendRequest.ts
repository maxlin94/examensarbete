"use server";

import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export default async function declineFriendRequest(id: string) {
    try {
        const userId = await validateUser();
        if (!userId) {
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

        if (friendRequest.receiverId !== userId) {
            throw new Error("You are not authorized to decline this friend request.");
        }

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
