import React from "react";
import TopicCard from "./TopicCard";

interface LegalTopic {
  title: string;
  description: string;
  url: string;
}

interface LegalTopicsGridProps {
  topics?: LegalTopic[];
}

const defaultTopics: LegalTopic[] = [
  {
    title: "Agriculture, environment and natural resources",
    description:
      "Learn about laws and regulations related to agriculture, environmental protection, and natural resource management in Quebec.",
    url: "https://www.quebec.ca/en/agriculture-environment-and-natural-resources",
  },
  {
    title: "Education",
    description:
      "Explore legal frameworks and policies governing education, schools, and academic institutions in Quebec.",
    url: "https://www.quebec.ca/en/education",
  },
  {
    title: "Businesses",
    description:
      "Find information on business regulations, licensing, and support for entrepreneurs and self-employed workers in Quebec.",
    url: "https://www.quebec.ca/en/businesses-and-self-employed-workers",
  },
  {
    title: "Family and support for individuals",
    description:
      "Access resources and legal guidance on family matters, social support, and individual assistance programs in Quebec.",
    url: "https://www.quebec.ca/en/family-and-support-for-individuals",
  },
  {
    title: "Finance, income and other taxes",
    description:
      "Understand tax laws, financial regulations, and income-related policies in Quebec.",
    url: "https://www.quebec.ca/en/finance-income-and-other-taxes",
  },
  {
    title: "Housing and Territory",
    description:
      "Learn about housing laws, property rights, and territorial planning in Quebec.",
    url: "https://www.quebec.ca/en/housing-territory",
  },
  {
    title: "Immigration",
    description:
      "Get information on immigration laws, visa requirements, and settlement services in Quebec.",
    url: "https://www.quebec.ca/en/immigration",
  },
  {
    title: "Justice and civil status",
    description:
      "Explore legal systems, civil rights, and procedures related to justice and civil status in Quebec.",
    url: "https://www.quebec.ca/en/justice-and-civil-status",
  },
];

const LegalTopicsGrid = ({ topics = defaultTopics }: LegalTopicsGridProps) => {
  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Popular Legal Topics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {topics.map((topic, index) => (
            <TopicCard
              key={index}
              title={topic.title}
              description={topic.description}
              url={topic.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalTopicsGrid;