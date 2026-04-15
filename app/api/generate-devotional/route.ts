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
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "An inspiring and captivating title for the daily devotional.",
            },
            scripture: {
              type: SchemaType.STRING,
              description: "The opening scripture relevant to the devotional, including translation reference (e.g., Matthew 5:14 NKJV).",
            },
            keyWord: {
              type: SchemaType.STRING,
              description: "A short, punchy phrase encapsulating the core point. Example: 'Light is naturally visible.'",
            },
            wordFocus: {
              type: SchemaType.STRING,
              description: "The main text/exhortation of the devotional. Break down the revelation into directly actionable steps. Avoid being overly poetic.",
            },
            bibleInsight: {
              type: SchemaType.STRING,
              description: "A profound breakdown of a biblical character, role, or concept. Must be formatted like: 'Bible Insight (Person/Topic): [Content]'",
            },
            prayer: {
              type: SchemaType.STRING,
              description: "A short, powerful prayer related to the topic, ending in 'Amen.'",
            },
            confession: {
              type: SchemaType.STRING,
              description: "A strong prophetic declaration/confession in the first person. Usually multi-line or bulleted.",
            },
            actionPoint: {
              type: SchemaType.STRING,
              description: "A single, highly actionable step for the reader to take today.",
            },
            quiz: {
              type: SchemaType.ARRAY,
              description: "3 simple quiz questions to test reading comprehension of the devotional.",
              items: {
                type: SchemaType.STRING,
              },
            },
          },
          required: ["title", "scripture", "keyWord", "wordFocus", "bibleInsight", "prayer", "confession", "actionPoint", "quiz"],
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
      
      CRITICAL INSTRUCTION: You must structure the output EXACTLY matching this pattern, ensuring no fields are missed:
      - Title
      - Opening Scripture (Always include version e.g. NKJV)
      - Key Word (A punchy naturally visible truth)
      - Word Focus
      - Bible Insight (Person/Topic): [Content]
      - Prayer
      - Confession (Use bullet points or short exact statements like 'I am light. I shine naturally.')
      - Action Point
      - Quiz (3 questions)
      
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
