import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import LegalTopicsGrid from "./LegalTopicsGrid";
import ChatButton from "./ChatButton";
import VoiceButton from "./VoiceButton";
import DemoSection from "./DemoSection";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAskQuestion = () => {
    setIsChatOpen(true);
  };

  const handleVoiceButtonClick = () => {
    console.log("Voice button clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <HeroSection onAskQuestion={handleAskQuestion} />
        <LegalTopicsGrid />
        <DemoSection videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      </main>
      <VoiceButton onClick={handleVoiceButtonClick} />
      <ChatButton isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default Home;