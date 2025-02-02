import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Lottie from "react-lottie";

interface VoiceButtonProps {
  onClick?: () => void;
}

const VoiceButton = ({ onClick }: VoiceButtonProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);  // Track current audio

  // Load animation
  useEffect(() => {
    fetch("/voiceicon.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  // Close modal and stop audio playback if any
  const handleModalClose = () => {
    setModalOpen(false);
    stopRecording();
    setTranscript("");
    
    // Stop the current audio if it's playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);  // Reset current audio
    }
  };

  // Open modal
  const handleVoiceButtonClick = () => {
    setModalOpen(true);
    if (onClick) onClick();
  };

  // Start recording and connect to Deepgram
  const startRecording = async () => {
    try {
      console.log("🎤 Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      const deepgramSocket = new WebSocket("wss://api.deepgram.com/v1/listen", [
        "token",
        import.meta.env.VITE_DEEPGRAM_API_KEY
      ]);
        
      deepgramSocket.onopen = () => {
        console.log("✅ Connected to Deepgram WebSocket");
      };

      deepgramSocket.onmessage = (message) => {
        console.log("📩 Deepgram Raw Response:", message.data);

        try {
          const data = JSON.parse(message.data);
          if (data.channel?.alternatives[0]?.transcript) {
            const newTranscript = data.channel.alternatives[0].transcript;
            console.log("📝 Received Transcript:", newTranscript);

            setTranscript(newTranscript);

            // Send transcript to DeepSeek (same as ChatButton)
            fetchDeepSeekResponse(newTranscript);
          } else {
            console.warn("⚠️ No transcript found in Deepgram response:", data);
          }
        } catch (error) {
          console.error("❌ Error parsing Deepgram response:", error);
        }
      };

      deepgramSocket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
      };

      deepgramSocket.onclose = () => {
        console.log("🔌 WebSocket Closed");
      };

      recorder.ondataavailable = async (event) => {
        console.log("🎤 Audio Data Available:", event.data);
        if (deepgramSocket.readyState === WebSocket.OPEN) {
          const arrayBuffer = await event.data.arrayBuffer();
          deepgramSocket.send(arrayBuffer);
          console.log("📡 Sent audio to Deepgram");
        } else {
          console.warn("⚠️ WebSocket not open when trying to send audio");
        }
      };

      recorder.start(1000); // Send data every second
      console.log("⏺️ Recording started...");
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("❌ Microphone error:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log("🛑 Stopping recording...");
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  // Fetch response from DeepSeek AI
  const fetchDeepSeekResponse = async (message: string) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            { role: "system", content: `You are a helpful legal assistant specializing in Quebec law.` },
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from DeepSeek.");
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || "No response from DeepSeek.";

      // Now send response to Deepgram TTS for speech output
      await fetchTextToSpeech(assistantMessage);
    } catch (error) {
      console.error("Error fetching response from DeepSeek:", error);
    }
  };

  // Convert DeepSeek response to speech (TTS)
  const fetchTextToSpeech = async (text: string) => {
    try {
      console.log("Sending TTS request to Deepgram...");
      
      // Only pass the text field
      const body = {
        text: text,  // This should be the only required field
      };
  
      console.log("Request Payload:", JSON.stringify(body));  // Log request body for debugging
  
      const response = await fetch("https://api.deepgram.com/v1/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Deepgram TTS Error Response:", errorData);
        throw new Error(`Failed to fetch TTS audio: ${JSON.stringify(errorData)}`);
      }
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
  
      // Create a new Audio instance and play it
      const audio = new Audio(audioUrl);
      audio.play();
      console.log("TTS audio played successfully.");

      // Set the current audio and add event listener for when it finishes
      setCurrentAudio(audio);
      audio.onended = () => {
        console.log("TTS audio finished.");
        setCurrentAudio(null);  // Reset current audio when finished
      };
    } catch (error) {
      console.error("Error with Deepgram TTS:", error);
    }
  };  

  return (
    <>
      <button
        onClick={handleVoiceButtonClick}
        className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Icon icon="mdi:microphone" className="h-6 w-6" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button onClick={handleModalClose} className="absolute top-2 right-2 text-white">
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>

          {animationData && (
            <div className="flex flex-col justify-center items-center text-white">
              <Lottie options={{ animationData, loop: true, autoplay: true }} height={400} width={400} />

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Transcript:</p>
                <p className="text-gray-300">{transcript || "Start speaking..."}</p>
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`mt-4 p-3 rounded-full ${isRecording ? "bg-red-600" : "bg-green-600"} text-white hover:opacity-90 transition-all`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceButton;