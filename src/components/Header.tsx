import React from "react";
import { MapPin } from "lucide-react";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 flex items-center justify-between fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img
            src="logo/Better-Call-Saul-AI-Logo.png" // Ensure the path is correct
            alt="Legal AI Assistant Logo"
            className="h-24 w-auto object-contain" // Increased height to h-24
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">Quebec</span>
        </div>
      </div>
    </header>
  );
};

export default Header;