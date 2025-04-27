import { Star } from "lucide-react";

type FeedbackItem = {
  username: string;
  content: string;
  rating: number;
};

export default function FeedbackSection() {
  const feedbackItems: FeedbackItem[] = [
    { username: "Username", content: "Feedback", rating: 3 },
    { username: "Username", content: "Feedback", rating: 3 },
    { username: "Username", content: "Feedback", rating: 3 },
  ];

  return (
    <section className="py-8 sm:py-12">
      {/* Title section (white background) */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 jaini text-topic text-custom-blue2">
          Feedback
        </h2>
      </div>

      {/* Feedback boxes section (blue background) */}
      <div className="bg-custom-blue3 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {feedbackItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <span className="text-gray-700 font-medium">
                    {item.username}
                  </span>
                </div>
                <div className="h-32 border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-600">{item.content}</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= item.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
