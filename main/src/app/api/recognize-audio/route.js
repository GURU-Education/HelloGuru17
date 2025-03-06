import fs from "fs";
import path from "path";
import sdk from "microsoft-cognitiveservices-speech-sdk";

export async function POST(req) {
  try {
    const { filename } = await req.json();
    if (!filename) {
      return new Response(JSON.stringify({ error: "No filename provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = path.join(process.cwd(), "public", "recordings", filename);
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = "zh-CN";

    const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filePath));

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      "你好，就我一个人。请给我一个靠窗的座位. 谢谢。我想点宫保鸡丁和一份米饭。好的，谢谢",
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      false
    );

    const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationAssessmentConfig.applyTo(speechRecognizer);

    return new Promise((resolve) => {
      speechRecognizer.recognizeOnceAsync(
        (result) => {
          const assessmentResult = result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult);
          resolve(
            new Response(JSON.stringify({ success: true, result: JSON.parse(assessmentResult) }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            })
          );
          speechRecognizer.close();
        },
        (err) => {
          console.error("Recognition error:", err);
          resolve(
            new Response(JSON.stringify({ error: "Failed to process audio" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            })
          );
          speechRecognizer.close();
        }
      );
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
