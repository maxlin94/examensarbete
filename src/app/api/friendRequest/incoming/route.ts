"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUser } from "@/util/userUtil";

export async function GET() {
    try {
        const user = await validateUser();
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
    }
}
