import { create } from "zustand";

type StoreState = {
    selectedFriend: FriendType | null;
    setSelectedFriend: (friendId: FriendType | null) => void;

    messages: Map<string, MessageType[]>;
    addMessage: (message: MessageType) => void;
    messageReceived: boolean;
    setMessageReceived: (received: boolean) => void;
    fetchMessages: (friendshipId: string) => Promise<void>;

    activePage: "chat" | "friends";
    setActivePage: (page: "chat" | "friends") => void;

    friendRequests: FriendRequestType[];
    fetchFriendRequests: () => void;
    friendRequestReceived: boolean;
    setFriendRequestReceived: (received: boolean) => void;

    friends: FriendType[];
    setFriends: (friends: FriendType[]) => void;
    fetchFriends: () => Promise<void>;
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
    messageReceived: false,
    setMessageReceived: (received: boolean) => set({ messageReceived: received }),
    fetchMessages: async (friendshipId: string) => {
        try {
            const response = await fetch(`/api/messages/${friendshipId}`);
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            set((state) => {
                const updatedMessages = new Map(state.messages);
                updatedMessages.set(friendshipId, data);
                return {
                    messages: updatedMessages
                };
            });
        } catch (error) {
            console.error(error);
        }
    },

    activePage: "chat",
    setActivePage: (page: "chat" | "friends") => set({ activePage: page }),

    friendRequests: [],
    fetchFriendRequests: async () => {
        try {
            const response = await fetch("/api/friendRequest/incoming");
            if (!response.ok) {
                throw new Error("Error fetching friend requests");
            }
            const data = await response.json();
            set({
                friendRequests: data,
                friendRequestReceived: data.length > 0,
            });
        } catch (error) {
            console.error(error);
        }
    },
    friendRequestReceived: false,
    setFriendRequestReceived: (received: boolean) => set({ friendRequestReceived: received }),

    friends: [],
    setFriends: (friends) => set({ friends }),
    fetchFriends: async () => {
        try {
            const response = await fetch("/api/friends");
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
