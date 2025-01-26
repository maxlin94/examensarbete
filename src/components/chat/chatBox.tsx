import ChatInput from '@/components/chat/chatInput';
import ScrollWrapper from '@/components/shared/scrollWrapper';
import useStore from '@/store';
import ChatMessages from './chatMessages';

export default function ChatBox() {
  const { selectedFriend } = useStore();

  return (
    <div className="flex flex-col w-3/4 p-4 rounded-md">
      <ScrollWrapper>
        <ChatMessages />
      </ScrollWrapper>
      {selectedFriend && (
        <ChatInput />
      )}
    </div>
  )
}