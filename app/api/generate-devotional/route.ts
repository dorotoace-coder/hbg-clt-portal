import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize the Gemini SDK
// Note: During local development, expect the `GOOGLE_GENERATIVE_AI_API_KEY` to be in `.env.local`
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctrinePack, targetDate, anchorCharacter, anchorScripture, previouslyGeneratedTitles, sourceType, rawMaterialText } = body;

    // We no longer strictly require doctrinePack if they supplied Sermon or Song.
    if (!sourceType && !doctrinePack) {
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

    // Construct Source Instruction Dynamically
    let sourceInstruction = "";
    if (sourceType === "sermon" && rawMaterialText) {
      sourceInstruction = `
      - Source Material: Raw Sermon Transcript / Notes
      - Provided Text: """${rawMaterialText}"""
      
      INSTRUCTION: Extract the major anchor points, deep revelation, and key scriptures directly from the sermon text provided above. Synthesize it into a powerful, focused bite-sized teaching.
      `;
    } else if (sourceType === "song" && rawMaterialText) {
      sourceInstruction = `
      - Source Material: Song Lyrics / Song Theme
      - Provided Text: """${rawMaterialText}"""
      
      INSTRUCTION: Build this devotional to highlight the spiritual theme, anchor lyrics, and the heart behind this song. Expand the core message of the song into a deep, biblical teaching. Keep the tone musical and inspiring.
      `;
    } else {
      sourceInstruction = `- Source Doctrine Pack: "${doctrinePack}"`;
    }

    const prompt = `
      You are the Devotional Generation Engine for the HBG-CLT ministry.
      Your writing persona must perfectly blend the following four spiritual dimensions:
      1. The authentic voice and personality of Pastor Amos Unogwu (energetic, faith-driven, deeply encouraging).
      2. The foundational teachings and "Win-Build-Send" culture of the Heartbeat of God (HBG) ministry.
      3. The deep doctrinal strength, scriptural mastery, and new-creation realities characteristic of Pastor Chris Oyakhilome.
      4. The piercing prophetic insight, fatherly authority, and profound simplicity of Pastor E.A. Adeboye.
      
      Your task is to draft a daily devotional from the provided source material while fully embodying this exact spiritual cadence.
      
      Here is the context for today's devotional:
      - Target Date: ${targetDate || "Today"}
      ${sourceInstruction}
      - Anchor Character / Theme: ${anchorCharacter || "Not specified (use an appropriate biblical figure related to the topic if it fits)"}
      - Anchor Scripture: ${anchorScripture || "Not specified (find an appropriate scripture if not explicitly stated in the source text)"}
      
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
