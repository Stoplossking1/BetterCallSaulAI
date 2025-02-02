import React from "react";

interface DemoSectionProps {
  videoUrl: string;
}

const DemoSection = ({ videoUrl }: DemoSectionProps) => {
  const embedUrl = videoUrl.replace("watch?v=", "embed/");

  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Product Demo
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <iframe
              width="100%"
              height="450"
              src={embedUrl}
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;