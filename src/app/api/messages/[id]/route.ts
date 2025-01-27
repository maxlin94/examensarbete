import { NextResponse } from "next/server";
import { NextApiRequest } from "next"
import prisma from "@/util/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { id } = await params;
        const { searchParams } = new URL(req.url || '');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const messages = await prisma.friendship.findFirst({
            where: { id: id

            },
            select: {
                messages: {
                    where: {
                        OR: [
                            { senderId: session.user.id },
                            { receiverId: session.user.id }
                        ]
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: limit,
                    skip: offset,
                    select: {
                        content: true,
                        senderId: true,
                        receiverId: true
                    }
                }
            }
        });
        return NextResponse.json(messages?.messages.reverse());
    } catch (e) {
        console.error("Error fetching messages:", e);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
