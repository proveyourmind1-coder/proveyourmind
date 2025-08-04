import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages, type UIMessage, StreamingTextResponse } from "ai" // Explicit imports to avoid bundling issues

// Configure OpenAI securely
const configuredOpenaiModel = openai({
  apiKey: process.env.OPENAI_API_KEY!, // Securely loading from env variable
})

export async function POST(req: NextRequest) {
  console.log("Chat API route accessed - Version 3.2") // Updated for debugging
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = await streamText({
      model: configuredOpenaiModel("gpt-4o"),
      messages: convertToModelMessages(messages),
      system: `You are a helpful and friendly assistant for "ProveYourMind", an online quiz platform where users can earn real money. Your goal is to assist users with questions about gameplay, rewards, features, and general information about the platform. Keep your answers concise and encouraging.`,
    })

    return new StreamingTextResponse(result.toDataStream()) // Use result.toDataStream() for StreamingTextResponse
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
