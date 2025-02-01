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

interface ChatButtonProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ChatButton = ({ isOpen = false, onOpenChange }: ChatButtonProps) => {
  const [open, setOpen] = useState(isOpen);
  const [message, setMessage] = useState("");

  // Sync the internal `open` state with the `isOpen` prop
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700"
          size="icon"
          aria-label="Open chat"
          onClick={() => handleOpenChange(true)} // Use handleOpenChange to ensure synchronization
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
          <div className="h-[400px] bg-gray-50 rounded-md p-4">
            <div className="text-center text-gray-500 mt-[160px]">
              Start a conversation by typing your legal question below.
            </div>
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