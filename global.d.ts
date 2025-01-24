declare global {
    type UserDto = {
        id: string;
        name: string;
    }

    type FriendType = {
        name: string;
        id: string;
        isFriend?: boolean;
        isFriendRequestSent?: boolean;
        friendshipId?: string;
        lastMessage?: MessageType | null;
    }

    type FriendRequestType = {
        id: string;
        user: UserDto;
    };

    type MessageType = {
        content: string;
        senderId: string;
        receiverId: string;
        friendshipId: string;
        sentByUser?: boolean;
        createdAt?: Date;
    };
}

export {};
