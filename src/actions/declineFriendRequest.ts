"use server";

import prisma from "@/util/prisma";
import { validateUser } from "@/util/user";

export default async function declineFriendRequest(id: string) {
    try {
        const user = await validateUser();
        if (!user) {
            throw new Error("User not found.");
        }

        const friendRequest = await prisma.friendRequest.findUnique({
            where: {
                id: id,
            },
        });

        if (!friendRequest) {
            throw new Error("Friend request not found.");
        }

        if (friendRequest.receiverId !== user?.id) {
            throw new Error("You are not authorized to decline this friend request.");
        }

        await prisma.friendRequest.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.log(error);
    }
}
