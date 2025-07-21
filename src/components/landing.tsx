"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Users,
  Bot,
  BookOpen,
  Sparkles,
  EyeOff,
  Shield,
  Smile,
  Frown,
  Angry,
  Laugh,
  ChevronDown,
  MessageCircle,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function EmpathiaLanding() {
  const [currentEmotion, setCurrentEmotion] = useState(0)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const emotions = [
    { icon: Smile, color: "text-yellow-400", bg: "bg-yellow-100", name: "Happy" },
    { icon: Heart, color: "text-pink-400", bg: "bg-pink-100", name: "Love" },
    { icon: Frown, color: "text-blue-400", bg: "bg-blue-100", name: "Sad" },
    { icon: Angry, color: "text-red-400", bg: "bg-red-100", name: "Angry" },
    { icon: Laugh, color: "text-green-400", bg: "bg-green-100", name: "Joy" },
  ]

  const faqItems = [
    {
      question: "Is the app available on multiple platforms?",
      answer:
        "Yes! Empathia is available on iOS, Android, and web browsers. You can access your stories and connections from any device.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Empathia is completely free to use. We believe emotional support and connection should be accessible to everyone.",
    },
    {
      question: "How can I cancel my subscription?",
      answer:
        "Since Empathia is free, there's no subscription to cancel. You can simply stop using the app anytime, though we'd love to have you stay!",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our support team through the in-app help center, email us at support@Empathia.com, or use the chat widget on our website.",
    },
    {
      question: "How do I refer my friends to Empathia?",
      answer:
        "You can invite friends through the app's sharing feature, send them your referral link, or simply tell them about Empathia - word of mouth is powerful!",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmotion((prev) => (prev + 1) % emotions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }

    setRipples((prev) => [...prev, newRipple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 1000)
  }

  const StoryComposer = () => {
    const [storyText, setStoryText] = useState("")
    const [selectedEmotion, setSelectedEmotion] = useState(0)
    const [isAnonymous, setIsAnonymous] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 280

    const handlePost = () => {
      if (storyText.trim()) {
        const event = { currentTarget: document.querySelector(".story-composer") } as any
        createRipple(event)
        setTimeout(() => {
          setStoryText("")
          setIsExpanded(false)
        }, 1000)
      }
    }

    return (
      <div className="max-w-2xl mx-auto mb-16 relative z-10">
        <Card className="story-composer bg-gray-50 dark:bg-black/80 border border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <EyeOff className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">Anonymous #8386</div>
                  <div className="text-sm text-purple-600 dark:text-purple-200">Your story will be completely private</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-purple-600 dark:text-purple-200">Anonymous</span>
                <div
                  className={`w-14 h-7 rounded-full cursor-pointer transition-all duration-300 ${
                    isAnonymous ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-600"
                  }`}
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 mt-0.5 ${
                      isAnonymous ? "translate-x-7" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="relative mb-6">
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="How are you feeling today? Share what's on your mind..."
                className="w-full p-6 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl resize-none focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-200/40 text-lg"
                rows={isExpanded ? 5 : 3}
                maxLength={maxLength}
              />
              <div className="absolute bottom-4 right-4 text-sm  text-purple-500 dark:text-purple-200/60">
                {storyText.length}/{maxLength}
              </div>
            </div>

            {/* Emotion Selector */}
            {isExpanded && (
              <div className="mb-6 animate-in slide-in-from-top duration-500">
                <div className="text-sm text-purple-600 dark:text-purple-200 mb-3 font-medium">How are you feeling?</div>
                <div className="flex space-x-4">
                  {emotions.map((emotion, index) => {
                    const Icon = emotion.icon
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedEmotion(index)}
                        className={`group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          selectedEmotion === index
                            ? `${emotion.bg} scale-110 shadow-lg shadow-${emotion.color.split("-")[1]}-500/30`
                            : "bg-white/10 hover:bg-white/20 hover:scale-105"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${selectedEmotion === index ? emotion.color : "text-white/60"}`} />
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-600 dark:text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          {emotion.name}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-purple-500 dark:text-purple-200/80">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Assisted</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isExpanded && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false)
                      setStoryText("")
                    }}
                    className="rounded-xl border-white/20 text-gray-900 dark:text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  onClick={handlePost}
                  disabled={!storyText.trim()}
                  className={`rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
                    storyText.trim()
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {storyText.trim() ? "Share Story" : "Write something..."}
                </Button>
              </div>
            </div>

            {/* Success Animation */}
            {storyText.trim() && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center space-x-3 text-green-300">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Your story will create positive ripples in the community!</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Story Feed Component
  const StoryFeed = () => {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Anonymous Stories</h3>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/10 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Anonymous #2158</div>
                  <div className="text-gray-700 dark:text-white/80 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Happy</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/90 mb-4 leading-relaxed">
              "Finally found the courage to share my story after months of keeping it inside. This community has given
              me hope that I'm not alone in this journey..."
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-900 dark:text-white/60 hover:text-pink-400 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>247</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-900 dark:text-white/60 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>89</span>
                </button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/10 bg-transparent"
              >
                Connect
              </Button>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Anonymous #2743</div>
                  <div className="text-gray-700 dark:text-white/80 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />5 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">Reflective</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/90 mb-4 leading-relaxed">
              "Today I learned that it's okay to not be okay. Sometimes the strongest thing you can do is admit you need
              help..."
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-900 dark:text-white/60 hover:text-pink-400 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>1.2k</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-900 dark:text-white/60 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>156</span>
                </button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/10 bg-transparent"
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Trending Dashboard Component
  const TrendingDashboard = () => {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Emotions</h3>
          <div className="flex items-center space-x-2 text-gray-700 dark:text-white/60">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Live updates</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-4 border border-pink-400/30">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-pink-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1.2k</span>
            </div>
            <div className="text-pink-300 font-medium">Love & Support</div>
            <div className="text-gray-700 dark:text-white/60 text-sm">+23% today</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-400/30">
            <div className="flex items-center justify-between mb-2">
              <Frown className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">892</span>
            </div>
            <div className="text-blue-300 font-medium">Seeking Help</div>
            <div className="text-gray-700 dark:text-white/60 text-sm">+15% today</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-2">
              <Smile className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">2.1k</span>
            </div>
            <div className="text-yellow-300 font-medium">Joy & Hope</div>
            <div className="text-gray-700 dark:text-white/60 text-sm">+31% today</div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-400/30">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">567</span>
            </div>
            <div className="text-green-300 font-medium">Growth</div>
            <div className="text-gray-700 dark:text-white/60 text-sm">+18% today</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-gray-900 dark:text-white/90 text-sm">"How I overcame my anxiety"</span>
            </div>
            <span className="text-gray-700 dark:text-white/60 text-xs">🔥 Trending</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-900 dark:text-white/90 text-sm">"Finding hope in dark times"</span>
            </div>
            <span className="text-gray-700 dark:text-white/60 text-xs">🔥 Trending</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-900 dark:text-white/90 text-sm">"Building self-confidence"</span>
            </div>
            <span className="text-gray-700 dark:text-white/60 text-xs">🔥 Trending</span>
          </div>
        </div>
      </div>
    )
  }

  // Journal Interface Component
  const JournalInterface = () => {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">My Emotion Journal</h3>
          <Button size="sm" className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Today's Reflection</div>
                  <div className="text-gray-700 dark:text-white/80 text-sm">March 15, 2024</div>
                </div>
              </div>
              <Smile className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-gray-900 dark:text-white/90 text-sm leading-relaxed">
              "Feeling more optimistic today. The conversation with my therapist helped me see things from a different
              perspective..."
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-400/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Weekly Check-in</div>
                  <div className="text-gray-700 dark:text-white/80 text-sm">March 10, 2024</div>
                </div>
              </div>
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-gray-900 dark:text-white/90 text-sm leading-relaxed">
              "This week has been challenging but I'm learning to be more patient with myself. Small progress is still
              progress..."
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 dark:text-white/80 text-sm font-medium">Mood Tracker</span>
            <span className="text-gray-700 dark:text-white/60 text-xs">This week</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Smile className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Frown className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Smile className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <Laugh className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-green-400 text-sm font-medium">↗ Improving</span>
          </div>
        </div>
      </div>
    )
  }

  // Soul Profiles Grid Component
  const SoulProfilesGrid = () => {
    return (
      <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Soul Connections</h3>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/10 bg-transparent">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/20 hover:border-purple-400/40 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center ">
                <Heart className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Anonymous #2743</div>
                <div className="text-gray-700 dark:text-white/60 text-xs">92% compatibility</div>
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/80 text-sm mb-3">
              "Shares stories about overcoming challenges and finding inner strength..."
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-purple-100 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs">Hope</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Anonymous #2163</div>
                <div className="text-gray-700 dark:text-white/60 text-xs">87% compatibility</div>
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/80 text-sm mb-3">
              "Offers support and kind words to those who need encouragement..."
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Empathy</span>
              <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs">Care</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-400/20 hover:border-green-400/40 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Anonymous #2753</div>
                <div className="text-gray-700 dark:text-white/60 text-xs">94% compatibility</div>
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/80 text-sm mb-3">
              "Shares wisdom from life experiences and guides others through difficult times..."
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Wisdom</span>
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Guidance</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-400/20 hover:border-yellow-400/40 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Smile className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">Anonymous #2613</div>
                <div className="text-gray-700 dark:text-white/60 text-xs">89% compatibility</div>
              </div>
            </div>
            <p className="text-gray-900 dark:text-white/80 text-sm mb-3">
              "Spreads positivity and helps others find reasons to smile every day..."
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Joy</span>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">Positivity</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white/10 bg-transparent">
            View All Connections
          </Button>
        </div>
      </div>
    )
  }

    // AI Assistant Section
    const AIAssistantSection = () => {
      const [showAnalysis, setShowAnalysis] = useState(false)
      const [showSuggestions, setShowSuggestions] = useState(false)
      const [aiAssistanceEnabled, setAiAssistanceEnabled] = useState(true)
      const [chatInput, setChatInput] = useState("")
      const [aiChatInput, setAiChatInput] = useState("")
  
      const conversationHistory = [
        {
          type: "other",
          content: "I've been struggling with anxiety lately and don't know how to cope...",
          timestamp: "2:30 PM",
          user: "Anonymous #2743",
        },
        {
          type: "me",
          content: "I understand how you feel. I've been through similar struggles.",
          timestamp: "2:32 PM",
        },
        {
          type: "other",
          content: "Really? How did you manage to get through it?",
          timestamp: "2:33 PM",
          user: "Anonymous #2743",
        },
        {
          type: "me",
          content: "It took time, but therapy and meditation really helped me.",
          timestamp: "2:35 PM",
        },
      ]
  
      const aiChatHistory = [
        {
          type: "user",
          content: "How should I respond to someone sharing anxiety struggles?",
          timestamp: "2:30 PM",
        },
        {
          type: "ai",
          content:
            "Show empathy first, then share your own experience if relevant. Ask open-ended questions to encourage them to share more.",
          timestamp: "2:31 PM",
        },
        {
          type: "user",
          content: "What if they seem hesitant to open up more?",
          timestamp: "2:32 PM",
        },
        {
          type: "ai",
          content:
            "Give them space and time. You can say something like 'I'm here whenever you're ready to talk more' to show support without pressure.",
          timestamp: "2:33 PM",
        },
      ]
  
      return (
        <div className="relative">
              {/* Chat Interface */}
              <div className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <EyeOff className="w-6 h-6 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Anonymous #2743</h3>
                      <p className="text-gray-700 dark:text-white/60 text-sm flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Online now
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* Main Chat Area */}
                <div className="h-96 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Message 1 - Other user */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <div className="bg-gray-100 dark:bg-white/10 rounded-2xl p-3 border border-gray-200 dark:border-white/20">
                          <p className="text-gray-900 dark:text-white/90 text-sm leading-relaxed">
                            I've been struggling with anxiety lately and don't know how to cope...
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-white/60 mt-1">2:30 PM</div>
                      </div>
                    </div>
  
                    {/* AI Analysis & Suggestions for Message 1 - Only show if AI assistance is enabled */}
                    {aiAssistanceEnabled && (
                      <div className="ml-4 space-y-2">
                        {/* AI Analysis Accordion */}
                        <div>
                          <button
                            onClick={() => setShowAnalysis(!showAnalysis)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2 border border-purple-400/30 hover:border-purple-400/50 transition-all text-xs"
                          >
                            <Bot className="w-3 h-3 text-purple-700 dark:text-purple-300" />
                            <span className="text-purple-700 dark:text-purple-300 font-medium">AI Analysis</span>
                            <ChevronDown
                              className={`w-3 h-3 text-purple-700 dark:text-purple-300 transition-transform ${
                                showAnalysis ? "rotate-180" : ""
                              }`}
                            />
                          </button>
  
                          {showAnalysis && (
                            <div className="mt-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-400/20 animate-in slide-in-from-top duration-300">
                              <div className="space-y-1">
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Emotional state: Vulnerable, seeking support</p>
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Tone: Open but cautious</p>
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Intent: Looking for coping strategies</p>
                              </div>
                            </div>
                          )}
                        </div>
  
                        {/* Response Suggestions Accordion */}
                        <div>
                          <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-2 border border-blue-400/30 hover:border-blue-400/50 transition-all text-xs"
                          >
                            <Sparkles className="w-3 h-3 text-blue-300" />
                            <span className="text-blue-300 font-medium">Suggested Responses</span>
                            <ChevronDown
                              className={`w-3 h-3 text-blue-300 transition-transform ${
                                showSuggestions ? "rotate-180" : ""
                              }`}
                            />
                          </button>
  
                          {showSuggestions && (
                            <div className="mt-2 space-y-1 animate-in slide-in-from-top duration-300">
                              <button
                                onClick={() =>
                                  setChatInput(
                                    "I understand how you feel. I've been through similar struggles and found that...",
                                  )
                                }
                                className="w-full text-left bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg p-2 text-gray-900 dark:text-white/80 text-xs transition-colors border border-gray-200 dark:border-white/10 hover:border-white/20"
                              >
                                "I understand how you feel..."
                              </button>
                              <button
                                onClick={() => setChatInput("Have you tried any coping strategies that helped?")}
                                className="w-full text-left bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg p-2 text-gray-900 dark:text-white/80 text-xs transition-colors border border-gray-200 dark:border-white/10 hover:border-white/20"
                              >
                                "Have you tried any coping strategies?"
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
  
                    {/* Message 2 - Current user */}
                    <div className="flex justify-end">
                      <div className="max-w-[70%]">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3">
                          <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                            I understand how you feel. I've been through similar struggles and found that therapy really
                            helped me.
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-white/60 mt-1 text-right">2:32 PM</div>
                      </div>
                    </div>
  
                    {/* Message 3 - Other user */}
                    <div className="flex justify-start">
                      <div className="max-w-[70%]">
                        <div className="bg-gray-100 dark:bg-white/10 rounded-2xl p-3 border border-gray-200 dark:border-white/20">
                          <p className="text-gray-900 dark:text-white/90 text-sm leading-relaxed">
                            Really? How did you manage to get through it? I feel so overwhelmed sometimes.
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-white/60 mt-1">2:33 PM</div>
                      </div>
                    </div>
  
                    {/* AI Analysis & Suggestions for Message 3 - Only show if AI assistance is enabled */}
                    {aiAssistanceEnabled && (
                      <div className="ml-4 space-y-2">
                        {/* AI Analysis Accordion */}
                        <div>
                          <button
                            onClick={() => setShowAnalysis(!showAnalysis)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2 border border-purple-400/30 hover:border-purple-400/50 transition-all text-xs"
                          >
                            <Bot className="w-3 h-3 text-purple-700 dark:text-purple-300" />
                            <span className="text-purple-700 dark:text-purple-300 font-medium">AI Analysis</span>
                            <ChevronDown
                              className={`w-3 h-3 text-purple-700 dark:text-purple-300 transition-transform ${
                                showAnalysis ? "rotate-180" : ""
                              }`}
                            />
                          </button>
  
                          {showAnalysis && (
                            <div className="mt-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-400/20 animate-in slide-in-from-top duration-300">
                              <div className="space-y-1">
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Emotional state: Vulnerable, seeking support</p>
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Tone: Open but cautious</p>
                                <p className="text-gray-900 dark:text-white/80 text-xs">• Intent: Looking for coping strategies</p>
                              </div>
                            </div>
                          )}
                        </div>
  
                        {/* Response Suggestions Accordion */}
                        <div>
                          <button
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-2 border border-blue-400/30 hover:border-blue-400/50 transition-all text-xs"
                          >
                            <Sparkles className="w-3 h-3 text-blue-300" />
                            <span className="text-blue-300 font-medium">Suggested Responses</span>
                            <ChevronDown
                              className={`w-3 h-3 text-blue-300 transition-transform ${
                                showSuggestions ? "rotate-180" : ""
                              }`}
                            />
                          </button>
  
                          {showSuggestions && (
                            <div className="mt-2 space-y-1 animate-in slide-in-from-top duration-300">
                              <button
                                onClick={() =>
                                  setChatInput(
                                    "I understand how you feel. I've been through similar struggles and found that...",
                                  )
                                }
                                className="w-full text-left bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg p-2 text-gray-900 dark:text-white/80 text-xs transition-colors border border-gray-200 dark:border-white/10 hover:border-white/20"
                              >
                                "I understand how you feel..."
                              </button>
                              <button
                                onClick={() => setChatInput("Have you tried any coping strategies that helped?")}
                                className="w-full text-left bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-lg p-2 text-gray-900 dark:text-white/80 text-xs transition-colors border border-gray-200 dark:border-white/10 hover:border-white/20"
                              >
                                "Have you tried any coping strategies?"
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
  
                    {/* Message 4 - Current user */}
                    <div className="flex justify-end">
                      <div className="max-w-[70%]">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3">
                          <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                            It took time, but therapy and meditation really helped me. Small steps make a big difference.
                          </p>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-white/60 mt-1 text-right">2:35 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* User Input Section */}
                <div className="border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-black/40 to-black/60">
                  {/* AI Chat History - Only show if AI assistance is enabled */}
                  {aiAssistanceEnabled && (
                    <div className="p-4 border-b border-gray-200 dark:border-white/10">
                      <div className="flex items-center space-x-2 mb-3">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 font-medium text-sm">AI Chat History</span>
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-2">
                        {aiChatHistory.slice(-2).map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[80%]`}>
                              <div
                                className={`rounded-lg p-2 text-xs ${
                                  message.type === "user"
                                    ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30"
                                    : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white/80 border border-gray-200 dark:border-white/20"
                                }`}
                              >
                                <p className="leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* Main Input Area */}
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      {/* AI Assistance Toggle */}
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-10 h-5 rounded-full cursor-pointer transition-all duration-300 ${
                            aiAssistanceEnabled ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-600"
                          }`}
                          onClick={() => setAiAssistanceEnabled(!aiAssistanceEnabled)}
                        >
                          <div
                            className={`w-4 h-4 bg-gray-900 dark:bg-white rounded-full shadow-lg transition-transform duration-300 mt-0.5 ${
                              aiAssistanceEnabled ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </div>
                        <Bot className={`w-4 h-4 ${aiAssistanceEnabled ? "text-blue-400" : "text-gray-500"}`} />
                      </div>
  
                      {/* Chat Input */}
                      <div className="flex-1 relative">
                        <textarea
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl resize-none focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-700 dark:placeholder-white/40 text-sm"
                          rows={2}
                        />
                      </div>
  
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {aiAssistanceEnabled && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10 bg-transparent rounded-xl px-3 py-2 text-xs"
                            disabled={!chatInput.trim()}
                          >
                            <Bot className="w-3 h-3 mr-1" />
                            Ask AI
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-4 py-2"
                          disabled={!chatInput.trim()}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Send to User
                        </Button>
                      </div>
                    </div>
  
                    {/* Quick AI Topics - Only show if AI assistance is enabled */}
                    {aiAssistanceEnabled && (
                      <div className="space-y-2">
                        <div className="text-gray-700 dark:text-white/60 text-xs font-medium">Quick AI Topics:</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setChatInput("How should I respond empathetically?")}
                            className="bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-gray-900 dark:text-white/70 text-xs transition-colors border border-gray-200 dark:border-white/10"
                          >
                            💡 Empathy tips
                          </button>
                          <button
                            onClick={() => setChatInput("What questions should I ask?")}
                            className="bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-gray-900 dark:text-white/70 text-xs transition-colors border border-gray-200 dark:border-white/10"
                          >
                            ❓ Question ideas
                          </button>
                          <button
                            onClick={() => setChatInput("Help me understand their emotion")}
                            className="bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-gray-900 dark:text-white/70 text-xs transition-colors border border-gray-200 dark:border-white/10"
                          >
                            🎯 Emotion analysis
                          </button>
                          <button
                            onClick={() => setChatInput("How to show support without being pushy?")}
                            className="bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-gray-900 dark:text-white/70 text-xs transition-colors border border-gray-200 dark:border-white/10"
                          >
                            🤝 Support techniques
                          </button> <button
                          onClick={() => setChatInput("What's the best way to continue this conversation?")}
                          className="bg-gray-100 dark:bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 text-gray-900 dark:text-white/70 text-xs transition-colors border border-gray-200 dark:border-white/10"
                        >
                          💬 Conversation flow
                        </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
  
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
      )
    }
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-bounce" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Share stories
              <br />
              all together
              <br />
              with Empathia
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with people who truly understand you. Share your deepest thoughts anonymously and find your tribe
              in a safe, supportive community.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start sharing
            </Button>
            {/* Story Composer */}
            <div className="mt-16">
              <StoryComposer />
            </div>
          </div>
          <div className="relative">
            <StoryFeed />
            {/* 3D Character */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Heart className="w-16 h-16 text-primary-foreground" />
            </div>
            {/* Curved Lines */}
            <div className="absolute top-1/2 -right-20 w-96 h-96 opacity-30">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <path
                  d="M50,200 Q200,50 350,200 Q200,350 50,200"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="8"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section - moved up */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200 dark:border-white/20">
              <Bot className="w-5 h-5 text-blue-300" />
              <span className="text-gray-900 dark:text-white font-medium">AI-Powered Communication</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Smart conversation
              <br />
              assistance with
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                AI guidance
              </span>
            </h2>
            <p className="text-xl text-gray-900 dark:text-white/80 mb-8 leading-relaxed">
              Our AI analyzes conversations in real-time, suggests thoughtful responses, and provides instant guidance
              during your emotional conversations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">Real-time message analysis and tone assessment</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">Smart response suggestions based on context</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">Optional AI assistance toggle for privacy</span>
              </div>
            </div>
          </div>
          <AIAssistantSection />
        </div>
      </section>

      {/* Stories Unite Hearts Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Stories unite hearts</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <TrendingDashboard />
            {/* Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[500px] h-[500px] border-4 border-gray-200 dark:border-white/20 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute w-[400px] h-[400px] border-2 border-gray-200 dark:border-white/10 rounded-full animate-spin"
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
              ></div>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Explore the emotions
              <br />
              of your community
            </h3>
            <p className="text-xl text-gray-900 dark:text-white/80 leading-relaxed">
              Discover authentic stories, explore different perspectives, and connect with people who share similar
              experiences and emotions.
            </p>
          </div>
        </div>
      </section>

      {/* Discover Profiles Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Discover other
              <br />
              soul profiles
            </h3>
            <p className="text-xl text-gray-900 dark:text-white/80 leading-relaxed">
              Explore anonymous profiles, connect with kindred spirits, and build meaningful relationships based on
              shared experiences and emotions.
            </p>
          </div>
          <div className="relative">
            <SoulProfilesGrid />
            {/* Scattered Profile Cards */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl shadow-lg p-2 animate-bounce duration-1000"
            style={{ animationDelay: "0.5s" }}
            >
              <div className="w-full h-full bg-purple-200 rounded-xl"></div>
            </div>
            <div
              className="absolute -bottom-10 -right-10 w-20 h-20 bg-gray-900 dark:bg-white rounded-2xl shadow-lg p-2 animate-bounce duration-1000"
              style={{ animationDelay: "1s" }}
            >
              <div className="w-full h-full bg-blue-200 rounded-xl"></div>
            </div>
            <div
              className="absolute top-1/4 -right-16 w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl shadow-lg p-2 animate-bounce duration-1000"
              style={{ animationDelay: "25s" }}
            >
              <div className="w-full h-full bg-green-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Emotion Journals Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Create emotion journals</h3>
            <p className="text-xl text-gray-900 dark:text-white/80 leading-relaxed mb-8">
              Document your emotional journey with private journals. Track your feelings, reflect on your growth, and
              create a personal space for healing.
            </p>
          </div>
          <div className="relative">
            <JournalInterface />
            {/* Floating Elements */}
            <div className="absolute top-10 -right-10 w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <Smile className="w-8 h-8 text-white dark:text-black" />
            </div>
            <div
              className="absolute bottom-10 -left-10 w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div
              className="absolute top-1/2 -right-16 w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Orbital Ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[400px] h-[400px] border-4 border-gray-200 dark:border-white/20 rounded-full animate-spin"
                style={{ animationDuration: "25s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Expand your emotional world
            <br />
            in 3 simple steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Heart className="w-10 h-10 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect your heart</h3>
              <p className="text-gray-900 dark:text-white/70 leading-relaxed">
                Share your authentic emotions and experiences with our supportive community.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Users className="w-10 h-10 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invite soulmates</h3>
              <p className="text-gray-900 dark:text-white/70 leading-relaxed">
                Find and connect with people who truly understand your journey and experiences.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discover each other's emotional world</h3>
              <p className="text-gray-900 dark:text-white/70 leading-relaxed">
                Explore diverse perspectives and grow together through shared emotional experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Any questions?</h2>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index} className="bg-white dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/20 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="text-gray-900 dark:text-white font-medium">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-900 dark:text-white transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-900 dark:text-white/70 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center">
          <div className="relative inline-block mb-12">
            <h2 className="text-6xl font-bold leading-tight">
              Expand your
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                emotional circle
              </span>
              <br />
              with Empathia
            </h2>
            {/* 3D Characters */}
            <div className="absolute -top-10 -left-20 w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Heart className="w-12 h-12 text-primary-foreground" />
            </div>
            <div
              className="absolute -top-10 -right-20 w-24 h-24 bg-secondary rounded-full flex items-center justify-center shadow-2xl animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <Users className="w-12 h-12 text-secondary-foreground" />
            </div>
          </div>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Empathia for free
          </Button>
        </div>
      </section>
    </div>
  )
}
