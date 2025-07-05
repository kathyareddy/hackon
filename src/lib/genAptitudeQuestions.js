// lib/genAptitudeQuestions.js

export async function generateAptitudeQuestions(topic) {
  const prompt = `Generate 5 multiple choice aptitude questions on the topic "${topic}". Format the output strictly as a JSON array:
[
  {
    "question": "Sample aptitude question?",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
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
    console.error("❌ Error generating aptitude questions:", error);
    return [];
  }
}
