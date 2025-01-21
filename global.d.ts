type UserType = {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    isFriend: boolean,
    friendRequestSent: boolean
}

type FriendRequestType = {
    id: string,
    user: UserType
}

type MessageType = {
    content: string,
    senderId: string,
    receiverId: string,
    friendshipId: string
}

declare global {
    type UserType = UserType
    type FriendRequestType = FriendRequestType
    type MessageType = MessageType
}

export {};