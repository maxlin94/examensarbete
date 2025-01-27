"use server";

import { NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const token = await getToken({req});
        if (!token || !token.id) {
            return NextResponse.json({ error: "Unauthorized.", status: 401 });
        }
        const friendRequests = await prisma.friendRequest.findMany({
            
            where: {
                receiverId: token.id,
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        return NextResponse.json(friendRequests);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error.", status: 500 });
    }
}
