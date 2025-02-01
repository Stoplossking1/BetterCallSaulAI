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
    title: "Family Law",
    description:
      "Divorce, child custody, spousal support, and other family-related legal matters.",
    url: "https://www.justice.gc.ca/eng/fl-df/",
  },
  {
    title: "Criminal Law",
    description:
      "Understanding criminal charges, rights, and defense strategies in the Canadian justice system.",
    url: "https://www.justice.gc.ca/eng/csj-sjc/just/",
  },
  {
    title: "Corporate Law",
    description:
      "Business incorporation, contracts, and regulatory compliance for companies.",
    url: "https://www.ic.gc.ca/eic/site/cd-dgc.nsf/eng/home",
  },
  {
    title: "Civil Rights",
    description:
      "Protection of individual rights, discrimination cases, and constitutional freedoms.",
    url: "https://www.chrc-ccdp.gc.ca/eng",
  },
  {
    title: "Property Law",
    description:
      "Real estate transactions, landlord-tenant disputes, and property rights.",
    url: "https://www.justice.gc.ca/eng/fl-df/property-droit.html",
  },
  {
    title: "Constitutional Law",
    description:
      "Understanding Canadian constitutional rights, government powers, and legal frameworks.",
    url: "https://www.justice.gc.ca/eng/csj-sjc/just/07.html",
  },
  {
    title: "Contract Law",
    description:
      "Formation, enforcement, and dispute resolution for various types of contracts.",
    url: "https://www.justice.gc.ca/eng/fl-df/contract-contrat.html",
  },
  {
    title: "General",
    description:
      "General legal information and guidance for common legal questions.",
    url: "https://www.justice.gc.ca/eng/",
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