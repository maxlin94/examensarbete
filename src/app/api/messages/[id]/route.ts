import { NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const user = await validateUser();
        const { id } = await params;
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const messages = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId: user.id, friendId: id },
                    { userId: id, friendId: user.id }
                ]
            },
            select: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    select: {
                        content: true,
                        senderId: true,
                        receiverId: true
                    }
                }
            }
        });
        return NextResponse.json(messages?.messages);
    } catch (e) {
        console.error("Error fetching users:", e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
