import { NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const user = await validateUser();
        const { id } = await params;
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const friendship = await prisma.friendShip.findFirst({
            where: {
                id: id
            },
            include: {
                user: true,
                friend: true,
            },
        });
        if(!friendship) return NextResponse.json({ message: "Not found" }, { status: 404 });
        if(user.id !== friendship.user.id && user.id !== friendship.friend.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const messages = await prisma.message.findMany({
            where: {
                friendShipId: friendship.id
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        return NextResponse.json(messages);
    } catch (e) {
        console.error("Error fetching users:", e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
