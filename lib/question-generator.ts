// lib/question-generator.ts

export interface GeneratedQuestion {
  question: string;
  options: string[];
  answer: string; // from your JSON
}

export async function generateQuestions(
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  count = 5
): Promise<GeneratedQuestion[]> {
  try {
    const res = await fetch(`/data/${difficulty}.json`);
    if (!res.ok) throw new Error('Failed to load questions');

    const allQuestions: GeneratedQuestion[] = await res.json();

    // Shuffle and select a subset
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (err) {
    console.error('Error loading static questions:', err);
    return [];
  }
}
