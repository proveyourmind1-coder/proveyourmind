// components/AnimatedBadgeUnlock.tsx
"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"

type BadgeUnlockProps = {
  badgeName: string
  badgeIcon: string
  onClose: () => void
}

export default function AnimatedBadgeUnlock({ badgeName, badgeIcon, onClose }: BadgeUnlockProps) {
  // Auto close after 4 seconds
  useEffect(() => {
    const timeout = setTimeout(onClose, 4000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    >
      <div className="bg-white shadow-xl rounded-lg p-6 text-center relative max-w-sm w-[300px] border-4 border-yellow-400">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>

        <motion.img
          src={badgeIcon}
          alt={badgeName}
          className="w-20 h-20 mx-auto mb-4"
          initial={{ rotate: -45, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />

        <h2 className="text-lg font-bold text-gray-800 mb-1">🏆 Badge Unlocked!</h2>
        <p className="text-sm text-gray-600">{badgeName}</p>
      </div>
    </motion.div>
  )
}
