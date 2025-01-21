"use server";

import prisma from '@/lib/prisma';
import { validateUser } from '@/util/userUtil';

export async function sendFriendRequest(friendId: string) {
    try {
        const user = await validateUser();
        if (!user || user.id === friendId) {
            return;
        }

        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                receiverId: friendId,
                senderId: user.id,
            },
        });

        if (existingRequest) {
            return;
        }

        await prisma.friendRequest.create({
            data: {
                receiverId: friendId,
                senderId: user.id,
            },
        });
    }
    catch (error) {
        console.log(error)
        throw new Error("Error sending friend request");
    }
}