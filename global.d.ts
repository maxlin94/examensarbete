type UserType = {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    isFriend: boolean
}

declare global {
    type UserType = UserType
}

export {};