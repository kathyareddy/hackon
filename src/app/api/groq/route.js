import { NextResponse } from "next/server";
import { groqStream } from "@/lib/groq";

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ result: "❌ Invalid request" }, { status: 400 });
  }

  try {
    const aiResponse = await groqStream(prompt);
    return NextResponse.json({ result: aiResponse });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { result: "❌ Error generating response" },
      { status: 500 }
    );
  }
}
