import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  try {
    const res = await fetch("https://api.v0.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.V0_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "v0-1.5-md",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await res.json()

    console.log("✅ v0.dev Response:", JSON.stringify(data, null, 2)) // 👈 log everything

    return NextResponse.json(data)
  } catch (error) {
    console.error("❌ v0.dev API Error:", error)
    return NextResponse.json({ error: "Failed to connect to v0.dev" }, { status: 500 })
  }
}
