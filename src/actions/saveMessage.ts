"use server";

import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function saveMessage(message: MessageType) {
    const user = await validateUser();
    if (!user) {
        return;
    }
    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                {
                    AND: [{ userId: user.id }, { friendId: message.receiverId }],
                },
                {
                    AND: [{ userId: message.receiverId }, { friendId: user.id }],
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
            senderId: user.id,
            receiverId: message.receiverId,
            friendshipId: friendship.id,
        },
    });
}
