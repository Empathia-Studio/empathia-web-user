import ChatMain from '@/app/chat/components/ChatMain';
import ChatSidebar from './components/ChatSidebar';
import ChatInfo from './components/ChatInfo';

export default function Page() {
     return (
    <div className="flex h-full">
      <ChatSidebar />
      <ChatMain />
      <ChatInfo />
    </div>
  )
}
