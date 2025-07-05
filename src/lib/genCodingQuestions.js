// lib/genCodingQuestions.js

export async function generateCodingQuestions(topic) {
  const prompt = `Generate 5 multiple choice coding questions on the topic "${topic}". Format the output strictly as a JSON array:
[
  {
    "question": "Sample question?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  },
  ...
]`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ Invalid response from OpenRouter:", data);
      return [];
    }

    const text = data.choices[0].message.content;
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error("❌ Error generating coding questions:", error);
    return [];
  }
}
