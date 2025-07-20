"use client"

import { Bell, MessageCircle, Moon, Sun, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import User from "@/models/User"
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle"

export default function ModernNavbar() {
  const navigationItems = [
    { name: "Community", href: "/community" },
    { name: "Diary", href: "/diary" },
    { name: "Playground", href: "/playground" },
    { name: "About", href: "/about" },
]
const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if(userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    }
  },[]);

  return (
    <div className="flex justify-center w-full py-6 ">
      <nav className="flex items-center justify-between bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg max-w-4xl w-full mx-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full relative">
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-8 justify-start">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center space-x-4">
            <ThemeToggle />
          {/* Chat Icon */}
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-full">
            <MessageCircle className="h-5 w-5" />
          </Button>

          {/* Notification Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-full relative"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt="User" />
                  <AvatarFallback className="bg-gray-700 text-white">
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300 font-medium hidden sm:block">{user.displayName}</span>
              </div>
            ) : (
              <Button onClick={()=>router.push('/auth/login')} variant="ghost" className="text-gray-700 bg-white  hover:bg-gray-300 rounded-full">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
