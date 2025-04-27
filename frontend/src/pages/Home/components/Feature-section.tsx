import { Clock, FileText, Target } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
};

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <FileText className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4" />,
      title: "Ability to train beforehand",
    },
    {
      icon: <Clock className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4" />,
      title: "Actual exam timetable",
    },
    {
      icon: <Target className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4" />,
      title: "Targeted question papers",
    },
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 jaini text-topic text-custom-blue2">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-custom-blue3 text-white p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[300px]"
            >
              {feature.icon}
              <p className="text-base sm:text-lg mt-6 sm:mt-8 ubuntu text-box">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
