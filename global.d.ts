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

declare global {
    type UserType = UserType
    type FriendRequestType = FriendRequestType
}

export {};