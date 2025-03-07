import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

export async function POST(req) {
  try {
    console.log("audio called")
    const { audioData, filename } = await req.json();
    if (!audioData) {
      return new Response(JSON.stringify({ error: "No audio data provided" }), {
        status: 400,
      });
    }

    const recordingsDir = path.join(process.cwd(), "public", "recordings");

    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }

    const inputFilePath = path.join(recordingsDir, filename.replace(".wav", ".webm"));
    const outputFilePath = path.join(recordingsDir, filename);

    const buffer = Buffer.from(audioData, "base64");
    fs.writeFileSync(inputFilePath, buffer);

    // console.log(`Converting ${inputFilePath} to WAV...`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .toFormat("wav")
        .audioCodec("pcm_s16le")
        .audioFrequency(16000)
        .on("end", () => {
        //   console.log("Conversion complete:", outputFilePath);
          resolve(
            new Response(JSON.stringify({ success: true, path: `/recordings/${filename}` }), {
              status: 200,
            })
          );
        })
        .on("error", (err) => {
          console.error("Error converting file:", err);
          reject(
            new Response(JSON.stringify({ error: "Failed to convert audio file" }), {
              status: 500,
            })
          );
        })
        .save(outputFilePath);
    });
  } catch (error) {
    console.error("Error saving audio:", error);
    return new Response(JSON.stringify({ error: "Failed to save audio" }), {
      status: 500,
    });
  }
}
