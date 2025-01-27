"use server"

import prisma from "@/util/prisma";
import {getServerSession} from "next-auth";

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
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized: You must be logged in.");
    }

    const email = session.user.email;


    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new Error("User not found.");
    }
    return user;
}