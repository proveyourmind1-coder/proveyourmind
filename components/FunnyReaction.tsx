// components/FunnyReaction.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import React from "react"

interface FunnyReactionProps {
  type: "correct" | "wrong" | "timeout" | "completed"
  visible: boolean
}

const gifUrls: Record<FunnyReactionProps["type"], string> = {
  correct: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmV3OXBsdzVycGwxbTNpajh1OTFia2ZzNm9yd3VwbWs0NzFweDg2dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ZqlvCTNHpqrio/giphy.gif", // Happy Jumping
  wrong: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazZmNjYzOGs3eGRpYzRncHUxdGZwc3dzM29sdmdsYW1mbWphZzA4cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hPPx8yk3Bmqys/giphy.gif", // Angry Donald Duck
  timeout: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWRtZmpja3U0djBhZnp2YWhrY3J2MmsxbGp5ZGVxOWt2cXB1a2huNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JIX9t2j0ZTN9S/giphy.gif", // Confused cat
  completed: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTJvYzFoYjliZXppYWxzYXRlNGx2MWM5b3BnZ2dqY3QwbnRjaWNjeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6ZsYm5vOd8FJL5GM/giphy.gif", // Dancing victory
}

export const FunnyReaction: React.FC<FunnyReactionProps> = ({ type, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center mb-4"
        >
          <Image
            src={gifUrls[type]}
            alt={`${type} reaction`}
            width={300}
            height={200}
            className="rounded-xl shadow-lg"
            unoptimized
            priority
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
