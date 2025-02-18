import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Globe } from "lucide-react";
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
  const [language, setLanguage] = useState<"en" | "fr">("en");
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

  const translateMessage = async (text: string, targetLanguage: "en" | "fr") => {
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
            { role: "system", content: `Translate the following text to ${targetLanguage === "fr" ? "French" : "English"}.` },
            { role: "user", content: text },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch response: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || text;
    } catch (error) {
      console.error("Error translating message:", error);
      return text;
    }
  };

  const handleLanguageToggle = async () => {
    const newLanguage = language === "en" ? "fr" : "en";
    const translatedMessages = await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        text: await translateMessage(msg.text, newLanguage),
      }))
    );
    setMessages(translatedMessages);
    setLanguage(newLanguage);
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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages: [
              { role: "system", content: `You are a helpful legal assistant specializing in Quebec law. Always respond in ${language === "fr" ? "French" : "English"}.` },
              { role: "user", content: message },
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch response: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: Date.now() + 1,
          text: data.choices?.[0]?.message?.content || "No response from DeepSeek.",
          sender: "assistant",
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error fetching response from DeepSeek:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now() + 1, text: "Error processing your request.", sender: "assistant" },
        ]);
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

          <div className="flex justify-between items-center p-2">
            <span className="text-sm font-semibold">Language: {language === "en" ? "English" : "Français"}</span>
            <Button onClick={handleLanguageToggle} className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {language === "en" ? "Switch to French" : "Passer en anglais"}
            </Button>
          </div>

          <div className="h-[500px] bg-gray-50 rounded-md p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-[180px]">
                {language === "en"
                  ? "Start a conversation by typing your legal question below."
                  : "Commencez une conversation en tapant votre question juridique ci-dessous."}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
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

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder={language === "en" ? "Type your question here..." : "Tapez votre question ici..."}
              className="flex-1 p-2 border rounded-md"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              {language === "en" ? "Send" : "Envoyer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;
