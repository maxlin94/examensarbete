import { useState } from 'react';

type ChatInputProps = {
    sendMessage: (message: string) => void;
}

export default function ChatInput({ sendMessage }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [messageLoading, setMessageLoading] = useState(false);

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessageLoading(true);
            sendMessage(input);
            setInput('');
            setMessageLoading(false);
        }
    }

    return (
        <div className="mt-4 flex">
            <input
                type="text"
                className="flex-grow p-2 text-black rounded-l-md"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !messageLoading) handleSendMessage();
                }}
            />
            <button
                disabled={messageLoading}
                className={`p-2 bg-blue-500 text-white rounded-r-md ${messageLoading && 'opacity-50'}`}
                onClick={() => handleSendMessage}>
                Send
            </button>
        </div>
    )
}