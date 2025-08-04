// components/NotificationBell.tsx
"use client"

import React, { useState } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function NotificationBell() {
  const [open, setOpen] = useState(false)

  const notifications = [
    "🧠 New Quiz Categories Coming Soon!",
    "💎 Earn double rewards this weekend!",
    "🏆 Weekly Challenge starts Monday!",
    "🎮 Mini Games Section launching soon!",
  ]

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <button
        className="relative p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-5 h-5 text-gray-800" />
        {/* 🔴 Pulse Ring */}
        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* 📩 Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-2">📣 Announcements</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {notifications.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>🔹</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
