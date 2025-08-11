"use client"

import { Bell, MessageCircle, Moon, Sun, User as UserIcon, LogOut, BookText, Layout } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import {authApi} from "@/features/auth/services/auth.api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/shared/components/theme-toggle"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function ModernNavbar() {
  const navigationItems = [
    { name: "Community", href: "/community" },
    { name: "Diary", href: "/diary" },
    { name: "Playground", href: "/playground" },
    { name: "About", href: "/about" },
  ]
  const router = useRouter();
  const { isLoggedIn, user, setAuthState } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-center w-full py-4 ">
        <nav className="flex items-center justify-between bg-card dark:bg-card text-card-foreground px-6 py-3 rounded-full shadow-lg dark:shadow-foreground/10 max-w-4xl w-full mx-4 transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={()=>router.push('/')}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-background rounded-full relative">
                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8 justify-start">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Chat Icon */}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Notification Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-2">
              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt="User" />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground font-medium hidden sm:block">{user.displayName}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push('/wall')}>
                      <Layout className="mr-2 h-4 w-4" />
                      <span>My Wall</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/diary')}>
                      <BookText className="mr-2 h-4 w-4" />
                      <span>My Diary</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      authApi.logout().then(() => {
                        setAuthState(false, null);
                        router.push('/auth/login');
                      });
                    }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => router.push('/auth/login')} 
                  variant="secondary"
                  className="rounded-full cursor-pointer"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
