"use server";

import { NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function GET() {
    try {
        const user = await validateUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [{ userId: user.id }, { friendId: user.id }],
            },
            include: {
                user: true,
                friend: true,
            },
        });
        const friends = friendships.map((friendship) => {
            const isUser = friendship.userId === user.id;
            return {
                id: isUser ? friendship.friend.id : friendship.user.id,
                name: isUser ? friendship.friend.name : friendship.user.name,
                email: isUser ? friendship.friend.email : friendship.user.email,
                friendshipId: friendship.id
            };
        });
        return NextResponse.json(friends);
    } catch (error) {
        console.log(error);
    }
}
