import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Adam Maatouk",
    role: "Lead Full-Stack Developer + UI Designer",
    imageUrl: "logo/Adam.jpg",
    linkedinUrl: "https://www.linkedin.com/in/adammaatouk",
  },
  {
    id: 2,
    name: "Nessrine Tabta",
    role: "Lead Back-End Developer + AI Scrapper",
    imageUrl: "logo/Nessrine.png",
    linkedinUrl: "https://www.linkedin.com/in/nessrinetabta/",
  },
  {
    id: 3,
    name: "Ayoub Khial",
    role: "Back-End Developer + AI Scrapper",
    imageUrl: "logo/Ayoub.png",
    linkedinUrl: "https://www.linkedin.com/in/ayoub-khial/",
  },
  {
    id: 4,
    name: "Jordan Hodali",
    role: "Full-Stack Engineer",
    imageUrl: "logo/CJ.jpg",
    linkedinUrl: "https://www.linkedin.com/in/jordanhod/",
  },
];

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  const currentMember = teamMembers[currentIndex];

  return (
    <div className="w-full bg-blue-600 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          The Team
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 lg:left-8 p-2 text-white hover:text-blue-200 transition-colors"
          >
            <Icon icon="mdi:chevron-left" className="h-12 w-12" />
          </button>

          {/* Member Card */}
          <div className="flex flex-col items-center text-center">
            <a
              href={currentMember.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={currentMember.imageUrl}
                alt={currentMember.name}
                className="w-64 h-64 object-contain rounded-lg mb-6 cursor-pointer shadow-lg transition-transform hover:scale-105"
              />
            </a>
            <h3 className="text-2xl font-bold text-white">{currentMember.name}</h3>
            <p className="text-xl text-gray-200 mt-2">{currentMember.role}</p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-4 lg:right-8 p-2 text-white hover:text-blue-200 transition-colors"
          >
            <Icon icon="mdi:chevron-right" className="h-12 w-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;