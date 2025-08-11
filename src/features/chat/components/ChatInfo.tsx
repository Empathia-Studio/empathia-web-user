"use client"

import { ChevronRight, ChevronDown, Search, Bell, Facebook, Settings, UserMinus, Shield } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ChatInfo() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["media"])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleProfileClick = () => {
    console.log("Opening profile...")
  }

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    console.log(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`)
  }

  const handleSearch = () => {
    console.log("Opening search in conversation...")
  }

  const handleChatInfo = () => {
    console.log("Opening chat information...")
  }

  const handleCustomizeChat = () => {
    console.log("Opening chat customization...")
  }

  const handlePrivacySupport = () => {
    console.log("Opening privacy and support...")
  }

  const handleMediaClick = (type: string) => {
    console.log(`Opening ${type}...`)
  }

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Profile Section */}
      <div className="p-6 text-center border-b border-gray-700">
        <button onClick={handleProfileClick} className="group">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Doãn Tích"
            width={80}
            height={80}
            className="rounded-full mx-auto mb-3 group-hover:opacity-80 transition-opacity"
          />
        </button>
        <h2 className="font-semibold text-lg">Doãn Tích</h2>
        <p className="text-gray-400 text-sm">@Haovy2610</p>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleProfileClick}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Trang cá nhân"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={handleNotificationToggle}
            className={`p-3 rounded-full transition-colors ${
              notificationsEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-500"
            }`}
            title={notificationsEnabled ? "Tắt thông báo" : "Bật thông báo"}
          >
            <Bell size={20} />
          </button>
          <button
            onClick={handleSearch}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Tìm kiếm"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="flex justify-center space-x-6 mt-3 text-xs text-gray-400">
          <span>Trang cá nhân</span>
          <span>{notificationsEnabled ? "Tắt thông báo" : "Bật thông báo"}</span>
          <span>Tìm kiếm</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4 space-y-2">
          <button
            onClick={handleChatInfo}
            className="w-full flex items-center justify-between py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
          >
            <span className="text-sm">Thông tin về đoạn chat</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          <button
            onClick={handleCustomizeChat}
            className="w-full flex items-center justify-between py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
          >
            <span className="text-sm">Tùy chỉnh đoạn chat</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          <div className="py-1">
            <button
              onClick={() => toggleSection("media")}
              className="w-full flex items-center justify-between py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
            >
              <span className="text-sm">File phương tiện, file và liên kết</span>
              {expandedSections.includes("media") ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>

            {expandedSections.includes("media") && (
              <div className="ml-6 mt-2 space-y-1">
                <button
                  onClick={() => handleMediaClick("media")}
                  className="w-full flex items-center py-2 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
                >
                  <span className="text-xs text-gray-400 mr-3">📁</span>
                  <span className="text-sm">File phương tiện</span>
                </button>
                <button
                  onClick={() => handleMediaClick("files")}
                  className="w-full flex items-center py-2 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
                >
                  <span className="text-xs text-gray-400 mr-3">📄</span>
                  <span className="text-sm">File</span>
                </button>
                <button
                  onClick={() => handleMediaClick("links")}
                  className="w-full flex items-center py-2 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
                >
                  <span className="text-xs text-gray-400 mr-3">🔗</span>
                  <span className="text-sm">Liên kết</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handlePrivacySupport}
            className="w-full flex items-center justify-between py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors"
          >
            <span className="text-sm">Quyền riêng tư và hỗ trợ</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          {/* Additional Actions */}
          <div className="pt-4 border-t border-gray-700 space-y-2">
            <button
              onClick={() => console.log("Opening settings...")}
              className="w-full flex items-center py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors text-left"
            >
              <Settings size={16} className="text-gray-400 mr-3" />
              <span className="text-sm">Cài đặt</span>
            </button>
            <button
              onClick={() => console.log("Blocking user...")}
              className="w-full flex items-center py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors text-left"
            >
              <UserMinus size={16} className="text-gray-400 mr-3" />
              <span className="text-sm">Chặn</span>
            </button>
            <button
              onClick={() => console.log("Reporting conversation...")}
              className="w-full flex items-center py-3 hover:bg-gray-700 rounded-lg px-3 cursor-pointer transition-colors text-left"
            >
              <Shield size={16} className="text-gray-400 mr-3" />
              <span className="text-sm">Báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
