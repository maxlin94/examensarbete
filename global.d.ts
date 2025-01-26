declare global {
    type UserDto = {
        id: string;
        name: string;
        friendshipId?: string;
        isFriend?: boolean;
        isFriendRequestSent?: boolean;
    }

    type UserWithRelations = UserDto & {
        receivedRequests?: FriendRequestType[];
        friends?: FriendshipType[];
        asFriend?: FriendshipType[];
    }

    type FriendType = {
        name: string;
        id: string;
        friendshipId: string;
        lastMessage?: MessageType | null;
    }

    type FriendRequestType = {
        id: string;
        senderId: string;
        receiverId: string;
        user?: UserDto;
    };

    type MessageType = {
        content: string;
        senderId: string;
        receiverId: string;
        friendshipId: string;
        sentByUser?: boolean;
        createdAt?: Date;
    };

    type FriendshipType = {
        id: string;
        userId: string;
        friendId: string;
    }
}

export {};
