import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: "AI service is not configured. Please add your API key.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const chatHistory = [
      {
        role: "user",
        parts: [
          {
            text: "You are an AI trading assistant for Indian stock markets (NSE/BSE). Help users with stock analysis, trading signals, technical indicators (RSI, MACD, Bollinger Bands, moving averages), market sentiment, and portfolio management. Be concise, professional, and focused on Indian markets.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "I'm your AI trading assistant for Indian markets. I can help with stock analysis, trading signals, technical indicators, and portfolio management. What would you like to know?",
          },
        ],
      },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text().trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Please try again.",
    });
  }
}
