import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BookOpen,
  Scale,
  FileText,
  Users,
  Gavel,
  Building2,
  Shield,
  HelpCircle,
} from "lucide-react";

interface TopicCardProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  url?: string;
}

const ICONS: { [key: string]: React.ElementType } = {
  "Agriculture, environment and natural resources": Users,
  "Education": Gavel,
  "Businesses": Building2,
  "Family and support for individuals": Shield,
  "Finance, income and other taxes": BookOpen,
  "Housing and Territory": Scale,
  "Immigration": FileText,
  "Justice and civil status": HelpCircle,
};

const TopicCard = ({
  icon: IconComponent = HelpCircle,
  title = "Legal Topic",
  description = "Learn more about this important legal area and how it affects your rights and responsibilities.",
  url = "#",
}: TopicCardProps) => {
  const handleClick = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card
      className="w-[280px] h-[180px] transition-all hover:shadow-lg hover:-translate-y-1 bg-white cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <IconComponent className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default TopicCard;