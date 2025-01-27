"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized.", status: 401 });
        }

        const userId = token.id;

        const friendsWithLastMessages = await prisma.friendship.findMany({
            where: {
                OR: [{ userId: userId }, { friendId: userId }],
            },
            select: {
                id: true,
                user: {
                    select: { id: true, name: true, email: true },
                },
                friend: {
                    select: { id: true, name: true, email: true },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        content: true,
                        senderId: true,
                        receiverId: true,
                        createdAt: true
                    },
                },
            },
        });

        const response = friendsWithLastMessages.map((friendship) => {
            const friend = userId === friendship.user.id ? friendship.friend : friendship.user;
            const lastMessage = friendship.messages.length > 0 ? friendship.messages[0] : null;
            const sentByUser = lastMessage?.senderId === userId;
            return {
                id: friend.id,
                name: friend.name,
                friendshipId: friendship.id,
                lastMessage: lastMessage ? { ...lastMessage, sentByUser } : null,
            };
        });

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
    }
}
