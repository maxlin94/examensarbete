import { create } from 'zustand'

type StoreState = {
    selectedFriend: FriendType | null;
    setSelectedFriend: (friendId: FriendType | null) => void;

    messages: Map<string, MessageType[]>;
    addMessage: (message: MessageType) => void;
    setMessages: (friendshipId: string, messages: MessageType[]) => void;

    activePage: "chat" | "friends";
    setActivePage: (page: "chat" | "friends") => void;

    friendRequests: FriendRequestType[];
    fetchFriendRequests: () => void;

    friends: FriendType[];
    setFriends: (friends: FriendType[]) => void;
    fetchFriends: () => void;
};

const useStore = create<StoreState>((set) => ({
    selectedFriend: null,
    setSelectedFriend: (friend: FriendType | null) => set({ selectedFriend: friend }),

    messages: new Map(),
    addMessage: (message: MessageType) => {
        set((state) => {
            const friendshipId = message.friendshipId;
            const updatedMessages = new Map(state.messages);
            const currentMessages = updatedMessages.get(friendshipId) || [];
            updatedMessages.set(friendshipId, [...currentMessages, message]); 
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
    },

    friends: [],
    setFriends: (friends) => set({ friends }),
    fetchFriends: async () => {
        try {
            const response = await fetch('/api/friends');
            if (!response.ok) {
                throw new Error("Error fetching friends");
            }
            const data = await response.json();
            set({ friends: data });
        } catch (error) {
            console.error(error);
        }
    },
}));

export default useStore;