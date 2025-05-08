// import { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// export default function AdvertisementSection() {
//   const [currentIndex, setCurrentIndex] = useState(1);
//   const ads = Array(10)
//     .fill(null)
//     .map((_, i) => i + 1); // [1, 2, ..., 10]

//   const visibleAds = [
//     ads[(currentIndex - 1 + ads.length) % ads.length],
//     ads[currentIndex],
//     ads[(currentIndex + 1) % ads.length],
//   ];

//   const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % ads.length);
//   const prevSlide = () =>
//     setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-8 sm:py-12 lg:py-16 relative">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-14 jaini text-custom-blue2">
//           Advertisements
//         </h2>

//         <div className="relative max-w-7xl mx-auto">
//           {/* Navigation Buttons */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 sm:p-3 rounded-full shadow-xl hover:bg-white transition-all"
//           >
//             <FaChevronLeft className="text-gray-800 text-lg sm:text-xl" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 sm:p-3 rounded-full shadow-xl hover:bg-white transition-all"
//           >
//             <FaChevronRight className="text-gray-800 text-lg sm:text-xl" />
//           </button>

//           {/* Carousel */}
//           <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 px-4 sm:px-8 lg:px-16 overflow-hidden">
//             {visibleAds.map((ad, index) => (
//               <div
//                 key={ad}
//                 className={`transition-all duration-500 ease-in-out w-full ${
//                   index === 1
//                     ? "max-w-[90%] sm:max-w-[70%] md:max-w-2xl scale-100 sm:scale-110 z-20"
//                     : "max-w-[80%] sm:max-w-[60%] md:max-w-xl scale-90 sm:scale-95 opacity-90 sm:opacity-80 hidden sm:block"
//                 }`}
//               >
//                 <div className="bg-white rounded-xl overflow-hidden shadow-2xl h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
//                   <img
//                     src={`/images/Adver.png`} // Replace with dynamic src if needed
//                     alt={`Advertisement ${ad}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pagination Dots */}
//         <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 lg:mt-12">
//           {ads.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all ${
//                 index === currentIndex
//                   ? "bg-custom-blue2 w-5 sm:w-6"
//                   : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Define TypeScript interface for advertisement
interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

const AdvertisementSection: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch advertisements from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/advertisements"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }
        const data: Advertisement[] = await response.json();
        setAds(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Slider logic for 3+ ads
  const visibleAds: Advertisement[] =
    ads.length >= 3
      ? [
          ads[(currentIndex - 1 + ads.length) % ads.length],
          ads[currentIndex],
          ads[(currentIndex + 1) % ads.length],
        ]
      : ads;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % ads.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);

  // Auto-slide for 3+ ads
  useEffect(() => {
    if (ads.length < 3) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [ads, currentIndex]);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Loading advertisements...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (ads.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            No advertisements available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl lg:text-6xl font-bold text-center mb-8 sm:mb-10 lg:mb-14 jaini text-custom-blue2">
          Advertisements
        </h2>

        {ads.length >= 3 ? (
          // Slider for 3+ ads
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 sm:p-3 rounded-full shadow-xl hover:bg-white transition-all"
            >
              <FaChevronLeft className="text-gray-800 text-lg sm:text-xl" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 sm:p-3 rounded-full shadow-xl hover:bg-white transition-all"
            >
              <FaChevronRight className="text-gray-800 text-lg sm:text-xl" />
            </button>

            {/* Carousel */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 px-4 sm:px-8 lg:px-16 overflow-hidden">
              {visibleAds.map((ad, index) => (
                <div
                  key={ad.id}
                  className={`transition-all duration-700 ease-in-out w-full ${
                    index === 1
                      ? "max-w-[90%] sm:max-w-[70%] md:max-w-2xl scale-100 sm:scale-110 z-20"
                      : "max-w-[80%] sm:max-w-[60%] md:max-w-xl scale-90 sm:scale-95 opacity-70 hidden sm:block"
                  }`}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-3xl h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] hover:shadow-xl hover:scale-105 transition-transform duration-300">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 lg:mt-12">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-custom-blue2 w-5 sm:w-6"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Static cards for 1-2 ads
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-2xl max-w-[90%] sm:max-w-[70%] md:max-w-lg mx-auto h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdvertisementSection;
