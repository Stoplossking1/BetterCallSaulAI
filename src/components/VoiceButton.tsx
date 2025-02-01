import React from "react";
import { Icon } from "@iconify/react";

interface VoiceButtonProps {
  onClick?: () => void;
}

const VoiceButton = ({ onClick }: VoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
    >
      <Icon icon="mdi:microphone" className="h-6 w-6" />
    </button>
  );
};

export default VoiceButton;