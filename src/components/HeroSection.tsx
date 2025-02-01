import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MessageSquare } from "lucide-react";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onAskQuestion?: () => void;
  credentials?: string[];
  dataSources?: string[];
}

const HeroSection = ({
  onSearch = () => {},
  onAskQuestion = () => {},
  credentials = [
    "Licensed Legal Professionals",
    "AI-Powered Assistance",
    "Quebec Legal Database",
  ],
  dataSources = [
    "Quebec Legal Information Institute",
    "Supreme Court Decisions",
    "Provincial Legislation",
  ],
}: HeroSectionProps) => {
  return (
    <div className="w-full min-h-[400px] bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Your Quebec Legal Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant answers to your legal questions with AI-powered
            assistance
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
            onClick={onAskQuestion}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Ask a Legal Question
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Trusted Credentials
            </h3>
            <ul className="space-y-2">
              {credentials.map((credential, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  {credential}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Data Sources
            </h3>
            <ul className="space-y-2">
              {dataSources.map((source, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                  {source}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;