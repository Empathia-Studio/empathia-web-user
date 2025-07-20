"use client"

import { Search, Edit } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const conversations = [
  {
    id: 1,
    name: "Giang Nguyễn",
    message: "Bạn: ok m • 22 giờ",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: 2,
    name: "SWD_PRN_PRU_KY7_SU25",
    message: "Bạn: ai gánh công lượng • 1 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    isGroup: true,
  },
  {
    id: 3,
    name: "Fresher",
    message: "Thúy đã gửi 1 ảnh • 1 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    hasNotification: true,
  },
  {
    id: 4,
    name: "Trần Dũng",
    message: "Bạn: ờ oke đúng • 1 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    hasNotification: true,
  },
  {
    id: 5,
    name: "Cao Yến Nhi",
    message: "Nhi đã gửi một file đính kèm • 2 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: 6,
    name: "Giang Nguyễn",
    message: "Hoom ni thuyết trình swd • 2 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: 7,
    name: "Doãn Tích",
    message: "Bạn đã gửi một file đính kèm • 2 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    active: true,
  },
  {
    id: 8,
    name: "Trần Văn Hoàng Phúc",
    message: "Hoàng Phúc đã gửi 1 ảnh • 2 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: 9,
    name: "nhom ba em be",
    message: "Bạn: haizz ai r cũng sẽ ngủ q... • 2 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    hasNotification: true,
    isGroup: true,
  },
]

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState(7)

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (chatId: number) => {
    setActiveChat(chatId)
    console.log(`Switched to chat: ${chatId}`)
  }

  const handleNewChat = () => {
    console.log("Creating new chat...")
  }

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Đoạn chat</h1>
          <button onClick={handleNewChat} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <Edit size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleChatClick(conversation.id)}
            className={`flex items-center p-3 hover:bg-gray-700 cursor-pointer relative transition-colors ${
              activeChat === conversation.id ? "bg-gray-700" : ""
            }`}
          >
            <div className="relative">
              <Image
                src={conversation.avatar || "/placeholder.svg"}
                alt={conversation.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              {conversation.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
              {conversation.isGroup && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs">👥</span>
                </div>
              )}
            </div>

            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                {conversation.hasNotification && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <p className="text-gray-400 text-xs truncate mt-1">{conversation.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
