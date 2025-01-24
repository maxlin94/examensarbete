import { create } from 'zustand'

type StoreState = {
    selectedFriend: UserDto | null;
    setSelectedFriend: (friendId: UserDto) => void;
    messages: Map<string, MessageType[]>;
    addMessage: (message: MessageType) => void;
    setMessages: (friendshipId: string, messages: MessageType[]) => void;
    activePage: "chat" | "friends";
    setActivePage: (page: "chat" | "friends") => void;
    friendRequests: FriendRequestType[];
    fetchFriendRequests: () => void;
};

const useStore = create<StoreState>((set) => ({
    selectedFriend: null,
    setSelectedFriend: (friend: UserDto) => set({ selectedFriend: friend }),

    messages: new Map(),
    addMessage: (message: MessageType) => {
        set((state) => {
            const friendId = message.friendshipId;
            const updatedMessages = new Map(state.messages);
            const currentMessages = updatedMessages.get(friendId) || [];
            updatedMessages.set(friendId, [...currentMessages, message]); 
            return { messages: updatedMessages }; 
        });
    },
    setMessages: (friendshipId, messages) => {
        set((state) => {
            const updatedMessages = new Map(state.messages);
            updatedMessages.set(friendshipId, messages);
            return { messages: updatedMessages };
        });
    },

    activePage: "chat",
    setActivePage: (page: "chat" | "friends") => set({ activePage: page }),

    friendRequests: [],
    fetchFriendRequests: async () => {
        try {
            const response = await fetch('/api/friendRequest/incoming');
            if (!response.ok) {
                throw new Error("Error fetching friend requests");
            }
            const data = await response.json();
            set({ friendRequests: data });
        } catch (error) {
            console.error(error);
        }
    }
}));

export default useStore;