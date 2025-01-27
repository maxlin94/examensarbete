import { NextResponse } from "next/server";
import { NextApiRequest } from "next"
import prisma from "@/util/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextApiRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = await getToken({req});
        if (!token || !token.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
                            { senderId: token.id },
                            { receiverId: token.id }
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
