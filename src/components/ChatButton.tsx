import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import VoiceRecorder from "./VoiceRecorder";

interface ChatButtonProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const ChatButton = ({ isOpen = false, onOpenChange }: ChatButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage: ChatMessage = { role: "user", content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage("");
      setIsLoading(true);

      try {
        const assistantResponse = "I understand your legal question. According to Quebec law, I can provide you with general information about this topic. However, please note that this is legal information, not legal advice. For specific advice about your situation, I recommend consulting with a licensed attorney.";
        const assistantMessage: ChatMessage = { role: "assistant", content: assistantResponse };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoiceRecordingComplete = (transcribedText: string) => {
    setMessage(transcribedText);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700"
          size="icon"
          aria-label="Open chat"
          onClick={() => handleOpenChange(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Legal Assistant Chat</DialogTitle>
            <DialogDescription>
              Ask any legal question and get instant assistance from our AI
              legal helper.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[400px] bg-gray-50 rounded-md p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-[160px]">
                Start a conversation by typing your legal question below.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.role === "assistant"
                        ? "bg-blue-100 ml-4"
                        : "bg-gray-200 mr-4"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-center text-gray-500">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type your question here..."
              className="flex-1 p-2 border rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;