import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import LegalTopicsGrid from "./LegalTopicsGrid";
import ChatButton from "./ChatButton";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAskQuestion = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <HeroSection onAskQuestion={handleAskQuestion} />
        <LegalTopicsGrid />
      </main>
      <ChatButton isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default Home;