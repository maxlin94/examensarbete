declare global {
    type UserType = {
        id: string;
        name: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    };

    type UserDto = {
        name: string;
        id: string;
        isFriend?: boolean;
        isFriendRequestSent?: boolean;
        friendshipId?: string;
        lastMessage?: MessageType | null;
    };

    type FriendRequestType = {
        id: string;
        user: UserType;
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
