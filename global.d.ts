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

declare global {
    type UserType = UserType
}

export {};