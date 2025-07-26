// components/AnnouncementStrip.tsx
"use client"

import React from "react"
import Marquee from "react-fast-marquee"
import { Megaphone } from "lucide-react"

interface AnnouncementStripProps {
  announcements: string[]
}

export default function AnnouncementStrip({ announcements }: AnnouncementStripProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-200 to-orange-100 border-y border-yellow-400 py-1">
      <div className="flex items-center gap-2 px-4">
        <Megaphone className="w-4 h-4 text-yellow-700 animate-pulse" />
        <Marquee speed={50} gradient={false} className="text-sm text-yellow-900 font-medium">
          {announcements.map((msg, idx) => (
            <span key={idx} className="mx-4">
              🚀 {msg}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
