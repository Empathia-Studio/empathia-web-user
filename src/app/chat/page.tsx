import ChatMain from '@/features/chat/components/ChatMain';
import ChatSidebar from '../../features/chat/components/ChatSidebar';
import ChatInfo from '../../features/chat/components/ChatInfo';

export default function Page() {
     return (
    <div className="flex h-full">
      <ChatSidebar />
      <ChatMain />
      <ChatInfo />
    </div>
  )
}
