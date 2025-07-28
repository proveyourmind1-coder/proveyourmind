"use client"

import { useState } from "react"

export default function V0Generator() {
  const [prompt, setPrompt] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  async function generateCode() {
    setError("")
    setCode("Generating...")

    try {
      const res = await fetch("/api/v0-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      console.log("📦 Full API Response:", data)

      if (data?.choices?.[0]?.message?.content) {
        setCode(data.choices[0].message.content)
      } else if (data?.error) {
        setError(data.error)
        setCode("")
      } else {
        setCode("⚠️ No content received from v0.dev.")
      }
    } catch (err) {
      console.error("❌ Error calling v0.dev:", err)
      setError("API request failed. Please check server logs or internet.")
      setCode("")
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl border shadow">
      <h2 className="text-xl font-semibold mb-2">💡 Generate UI Component with v0.dev</h2>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Describe the component (e.g., 'Card with winner name, prize, and score')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={generateCode}
      >
        Generate Code
      </button>

      {error && (
        <div className="mt-4 p-2 text-red-600 font-medium">❌ {error}</div>
      )}

      {code && !error && (
        <pre className="mt-4 p-3 bg-gray-100 text-sm whitespace-pre-wrap rounded">
          {code}
        </pre>
      )}
    </div>
  )
}
