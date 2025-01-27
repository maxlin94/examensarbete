"use server";

import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function saveMessage(message: MessageType) {
    const userId = await validateUser();
    if (!userId) {
        return;
    }
    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                {
                    AND: [{ userId: userId }, { friendId: message.receiverId }],
                },
                {
                    AND: [{ userId: message.receiverId }, { friendId: userId }],
                },
            ],
        },
        select: {
            id: true
        },
    });
    if (!friendship) return;
    return prisma.message.create({
        data: {
            content: message.content,
            senderId: userId,
            receiverId: message.receiverId,
            friendshipId: friendship.id,
        },
    });
}
