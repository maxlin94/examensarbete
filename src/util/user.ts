"use server";

import prisma from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/util/authOptions";
import { Session } from "next-auth";

export async function getUsersByName(name: string, id: string): Promise<UserWithRelations[]> {
    return prisma.user.findMany({
        where: {
            name: {
                contains: name,
                mode: "insensitive",
            },
            NOT: {
                id: id,
            },
        },
        select: {
            id: true,
            name: true,
            friends: {
                where: {
                    friendId: id,
                },
                select: {
                    id: true,
                    userId: true,
                    friendId: true,
                },
            },
            asFriend: {
                where: {
                    userId: id,
                },
                select: {
                    id: true,
                    userId: true,
                    friendId: true,
                },
            },
            receivedRequests: {
                where: {
                    senderId: id,
                },
                select: {
                    id: true,
                    senderId: true,
                    receiverId: true,
                },
            },
        },
    });
}

export async function validateUser() {
    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return null;
    }
    return session.user.id;
}
