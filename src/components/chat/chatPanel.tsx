import FriendList from '@/components/chat/chatFriendList';
import ChatBox from '@/components/chat/chatBox';

export default function ChatPanel() {
  return (
    <div className="flex w-11/12 bg-slate-600 m-auto rounded-md h-[95%]">
      <FriendList/>
      <ChatBox/>
    </div>
  );
}