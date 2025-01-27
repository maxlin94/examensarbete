"use server";

import prisma from '@/util/prisma';
import { validateUser } from '@/util/user';

export async function sendFriendRequest(friendId: string) {
    try {
        const userId = await validateUser();
        if (!userId || userId === friendId) {
            return;
        }

        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                receiverId: friendId,
                senderId: userId,
            },
        });

        if (existingRequest) {
            return;
        }

        await prisma.friendRequest.create({
            data: {
                receiverId: friendId,
                senderId: userId,
            },
        });
    }
    catch (error) {
        console.log(error)
        throw new Error("Error sending friend request");
    }
}