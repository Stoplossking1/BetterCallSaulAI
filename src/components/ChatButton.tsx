import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ChatButtonProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
}

const ChatButton = ({ isOpen = false, onOpenChange }: ChatButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage("");

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a helpful legal assistant specializing in Quebec law.",
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch response from OpenAI");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: Date.now() + 1,
          text: data.choices[0].message.content,
          sender: "assistant",
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "Sorry, I couldn't process your request. Please try again.",
          sender: "assistant",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
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

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Legal Assistant Chat</DialogTitle>
            <DialogDescription>
              Ask any legal question related to Quebec law and get instant assistance from our AI legal helper.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[500px] bg-gray-50 rounded-md p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-[180px]">
                Start a conversation by typing your legal question below.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question here..."
              className="flex-1 p-2 border rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;