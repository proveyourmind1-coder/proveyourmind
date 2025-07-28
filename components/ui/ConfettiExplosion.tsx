"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@uidotdev/usehooks"

export default function ConfettiExplosion({ trigger }: { trigger: boolean }) {
  const { width, height } = useWindowSize()
  const [show, setShow] = useState(trigger)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [trigger])

  if (!show) return null

  return (
    <Confetti
      width={width || 800}
      height={height || 600}
      numberOfPieces={300}
      recycle={false}
    />
  )
}
