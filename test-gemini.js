const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash SUCCESS");
  } catch (e) {
    console.log("gemini-1.5-flash FAILED:", e.message);
  }
  
  try {
    const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result2 = await model2.generateContent("Hello");
    console.log("gemini-pro SUCCESS");
  } catch (e) {
    console.log("gemini-pro FAILED:", e.message);
  }

  try {
    const model3 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result3 = await model3.generateContent("Hello");
    console.log("gemini-1.5-flash-latest SUCCESS");
  } catch (e) {
    console.log("gemini-1.5-flash-latest FAILED:", e.message);
  }
}
run();
