import useStore from '@/store';

type ChatMessagesProps = {
    currentMessages: MessageType[];
}

export default function ChatMessages({ currentMessages }: ChatMessagesProps) {
    const { selectedFriend } = useStore();

    return (
        <>
            {selectedFriend && currentMessages.map((msg: MessageType, index) => (
                <div
                    key={index}
                    className={`m-2 relative rounded-md ${msg.senderId === selectedFriend.id ? 'text-left' : 'text-right'
                        }`}
                >
                    <span className="inline-block p-2 rounded-md bg-slate-800 break-all">{msg.content}</span>
                </div>
            ))}
        </>
    )
}