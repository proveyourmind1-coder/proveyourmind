import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai" // [^2]
import { openai } from "@ai-sdk/openai" // [^2]

export async function POST(request: NextRequest) {
  try {
    const { difficulty, category, count } = await request.json()

    // Define the structure for the AI to generate
    const questionSchema = `{
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correct": "number (0-3)",
          "explanation": "string",
          "category": "string",
          "difficulty": "string"
        }
      ]
    }`

    const prompt = `Generate ${count} quiz questions for a "${difficulty}" difficulty quiz in the "${category}" category.
    Each question should have 4 options, with one correct answer. Provide an explanation for the correct answer.
    Ensure the response is a JSON object matching this schema exactly: ${questionSchema}
    Make sure the 'correct' field is the 0-indexed number of the correct option.`

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o model [^2]
      prompt: prompt,
      temperature: 0.7, // Adjust creativity
    })

    // Parse the AI's response
    const generatedData = JSON.parse(text)

    // Basic validation to ensure the structure is as expected
    if (!generatedData || !Array.isArray(generatedData.questions)) {
      throw new Error("AI did not return questions in the expected format.")
    }

    return NextResponse.json({ questions: generatedData.questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}

// The static question generation function is no longer needed as we are using AI.
// function generateStaticQuestions(difficulty: string, category: string, count: number) {
//   // ... (removed static questions)
// }
