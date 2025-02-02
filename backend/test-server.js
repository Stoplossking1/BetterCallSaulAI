import express from "express";
import cors from "cors";
import fs from "fs";
import { execSync } from "child_process";
import { spawn } from "child_process";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Function to get sample rate from audio file using ffprobe
function getSampleRate(filePath) {
  try {
    const output = execSync(`ffprobe -i ${filePath} -show_entries stream=sample_rate -v quiet -of csv="p=0"`);
    return parseInt(output.toString().trim(), 10);
  } catch (error) {
    console.error("Error getting sample rate:", error);
    return 16000; // Default to 16kHz if extraction fails
  }
}

app.post("/huggingface-speech-to-text", async (req, res) => {
  try {
    const { audio } = req.body;
    if (!audio) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    console.log("🎤 Received audio data, processing...");

    // Convert Base64 to Buffer
    const buffer = Buffer.from(audio, "base64");

    // Save buffer as a temporary file
    const filePath = "temp_audio.wav";
    fs.writeFileSync(filePath, buffer);

    // Get actual sample rate from file
    const detectedSampleRate = getSampleRate(filePath);
    console.log(`🔍 Detected sample rate: ${detectedSampleRate} Hz`);

    // Run Python script to process audio with Hugging Face model
    const pythonProcess = spawn("python3", ["huggingface_speech.py", filePath]);

    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("✅ Transcription Complete:", result);
      res.json({ text: result.trim() });

      // Clean up temporary file
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error processing audio:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Hugging Face Test Server running on port ${PORT}`));
