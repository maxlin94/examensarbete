"use server";

import prisma from "@/lib/prisma";
import { validateUser } from "@/util/userUtil";

export default async function acceptFriendRequestAction(id: string) {
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

        await prisma.friendShip.create({
            data: {
                userId: user.id,
                friendId: friendRequest.senderId,
            },
        });

        await prisma.friendRequest.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.log(error);
    }
}
