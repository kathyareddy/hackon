// lib/openrouter.js

export async function getMentorResponse(prompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct", // or any supported model
        messages: [
          {
            role: "system",
            content:
              "You are an expert mentor helping students learn coding and aptitude.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}
