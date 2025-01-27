"use server";

import { NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export async function GET() {
    try {
        const user = await validateUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized.", status: 401 });
        }
        const friendRequests = await prisma.friendRequest.findMany({
            
            where: {
                receiverId: user.id,
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
