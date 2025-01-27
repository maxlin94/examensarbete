import ChatInput from '@/components/chat/chatInput';
import ScrollWrapper from '@/components/shared/scrollWrapper';
import useStore from '@/store';
import ChatMessages from './chatMessages';
import { useEffect, useRef, useState, useMemo } from 'react';

export default function ChatBox() {
  const { selectedFriend, fetchMessages, messages } = useStore();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loading, setLoading] = useState(false);
  const isScrolling = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentMessages = useMemo(() => {
    return messages.get(selectedFriend?.friendshipId || '') || [];
  }, [messages, selectedFriend]);

  const handleOnClick = async () => {
    setLoading(true);
    isScrolling.current = false;
    const length = await fetchMessages(selectedFriend?.friendshipId || '', currentMessages.length);
    isScrolling.current = true;
    setLoading(false);
    if (length < 20) setHasMoreMessages(false);
  }

  useEffect(() => {
    setHasMoreMessages(true);
  }, [selectedFriend]);

  useEffect(() => {
    if (!isScrolling.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [currentMessages]);


  return (
    <div className="flex flex-col w-3/4 p-4 rounded-md">
      {selectedFriend && (
        <>
          <ScrollWrapper>
            {currentMessages.length >= 20 && hasMoreMessages &&
              <div className="flex justify-center">
                <button onClick={handleOnClick} disabled={loading}>{loading ? "Loading..." : "Load more messages"}</button>
              </div>
            }
            <ChatMessages currentMessages={currentMessages} />
            <div ref={messagesEndRef} />
          </ScrollWrapper>
          <ChatInput />
        </>
      )}
    </div>
  )
}