"use server"

import prisma from "@/util/prisma";
import {getServerSession} from "next-auth";

export async function getUsersByName(name: string, id: string) {
    return prisma.user.findMany({
        where: {
            name: {
                contains: name,
                mode: "insensitive"
            },
            NOT: {
                id: id,
            },
            
        },
    });
}

export async function getFriendsByUserId(id: string) {
    return prisma.friendShip.findMany({
        where: {
            OR: [
                { userId: id },
                { friendId: id },
            ],
        },
        select: {
            id: true,
            userId: true,
            friendId: true,
        }
    });
}

export async function sanitizeUser(user: UserType) {
    const { name, id } = user;
    return { name, id }
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