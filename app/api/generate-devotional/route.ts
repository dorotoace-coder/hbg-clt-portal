import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize the Gemini SDK
// Note: During local development, expect the `GOOGLE_GENERATIVE_AI_API_KEY` to be in `.env.local`
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctrinePack, targetDate, anchorCharacter, anchorScripture, previouslyGeneratedTitles } = body;

    if (!doctrinePack) {
      return NextResponse.json({ error: "Doctrine Pack is required." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Generative AI API Key is missing from the environment." },
        { status: 500 }
      );
    }

    // Define the schema for the AI response
    // We use gemini-1.5-flash as it's the recommended default for text tasks
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "An inspiring and captivating title for the daily devotional.",
            },
            wordFocus: {
              type: SchemaType.STRING,
              description: "The main text/exhortation of the devotional. Should be around 150-250 words.",
            },
            prayer: {
              type: SchemaType.STRING,
              description: "A short, powerful prayer related to the topic.",
            },
            confession: {
              type: SchemaType.STRING,
              description: "A strong prophetic declaration/confession in the first person.",
            },
            quiz: {
              type: SchemaType.ARRAY,
              description: "3 quiz questions to test understanding of the devotional.",
              items: {
                type: SchemaType.STRING,
              },
            },
          },
          required: ["title", "wordFocus", "prayer", "confession", "quiz"],
        },
      },
    });

    const prompt = `
      You are an expert biblical editor and devotional writer for the HBG-CLT ministry.
      Your task is to draft a daily devotional based on a specific 'Doctrine Pack' sermon summary.
      
      Here is the context for today's devotional:
      - Target Date: ${targetDate || "Today"}
      - Source Doctrine Pack: "${doctrinePack}"
      - Anchor Character / Theme: ${anchorCharacter || "Not specified (use an appropriate biblical figure related to the topic)"}
      - Anchor Scripture: ${anchorScripture || "Not specified (find an appropriate scripture)"}
      
      ${previouslyGeneratedTitles?.length ? `IMPORTANT: Avoid using any of these recent titles again or similar concepts: ${previouslyGeneratedTitles.join(', ')}` : ""}

      Write a compelling, faith-filled devotional that adheres to sound doctrine. 
      Ensure the tone is uplifting, deeply biblical, and encourages spiritual settlement and growth.
      
      Provide the result strictly in the requested JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON output
    const generatedData = JSON.parse(text);

    return NextResponse.json({
      success: true,
      data: generatedData,
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate devotional." },
      { status: 500 }
    );
  }
}
