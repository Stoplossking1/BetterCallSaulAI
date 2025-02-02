import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleRate = 16000; // Ensure correct sample rate for Google

const VoiceRecorder: React.FC<{ onRecordingComplete: (text: string) => void }> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Float32Array[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("🎤 Microphone access granted", stream);
      } catch (error) {
        console.error("❌ Error accessing microphone:", error);
      }
    };
  
    setupRecorder(); // Call the async function inside `useEffect`
  
    return () => {
      console.log("🔄 Cleanup function runs here if needed");
    };
  }, []);
  

  const startRecording = async () => {
    try {
      console.log("🎤 Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate, channelCount: 1 }, video: false });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate });
      await audioContext.audioWorklet.addModule("/recorderWorkletProcessor.js");

      const audioInput = audioContext.createMediaStreamSource(stream);
      const processor = new AudioWorkletNode(audioContext, "recorder.worklet");

      processor.port.onmessage = (event) => recordedChunksRef.current.push(event.data);

      audioInput.connect(processor);
      processor.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      audioInputRef.current = audioInput;
      processorRef.current = processor;
      setIsRecording(true);
    } catch (error) {
      console.error("❌ Error accessing microphone:", error);
      toast({ title: "Microphone Error", description: "Cannot access microphone", variant: "destructive" });
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    console.log("🛑 Stopping recording...");
    
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();

    const recordedData = new Float32Array(
      recordedChunksRef.current.flatMap(chunk => Array.from(chunk))
    );
        const wavBlob = convertFloat32ArrayToWav(recordedData, sampleRate);
    recordedChunksRef.current = [];

    console.log("📤 Sending to backend...");
    const base64Audio = await convertBlobToBase64(wavBlob);

    try {
      const response = await fetch("http://localhost:2000/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64Audio }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to transcribe audio");

      console.log("✅ Transcription complete:", data.text);
      onRecordingComplete(data.text);
    } catch (error) {
      console.error("❌ Error processing audio:", error);
      toast({ title: "Processing Error", description: "Failed to process audio", variant: "destructive" });
    } finally {
      setIsRecording(false);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={isRecording ? stopRecording : startRecording}>
      {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

// 🛠 Convert Float32Array to WAV Blob
function convertFloat32ArrayToWav(samples: Float32Array, sampleRate: number) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  const floatTo16BitPCM = (offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  };

  floatTo16BitPCM(44, samples);

  return new Blob([view], { type: "audio/wav" });
}

const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); // Ensure it reads as a Base64 string
    reader.onloadend = () => {
      const base64String = reader.result as string; // Force it to be a string
      resolve(base64String.split("base64,")[1]); // Now `.split()` works
    };
    reader.onerror = reject;
  });
};


export default VoiceRecorder;
