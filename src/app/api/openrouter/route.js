import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { result: "❌ No prompt provided" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Replace with your domain in production
          "X-Title": "AI Interview Mentor",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Or any other available model
          messages: [
            {
              role: "system",
              content: "You are a helpful and detailed AI mentor.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const data = await response.json();

    const message = data?.choices?.[0]?.message?.content;
    return NextResponse.json({
      result: message || "❌ No response from model",
    });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return NextResponse.json(
      { result: "❌ Error reaching OpenRouter API" },
      { status: 500 }
    );
  }
}
