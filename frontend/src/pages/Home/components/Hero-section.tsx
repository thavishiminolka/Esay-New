import { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {Link }from "react-router-dom"
type Slide = {
  title: string;
  description: string;
  bgImage: string;
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: "WELCOME",
      description:
        "Welcome to Esay! We're excited to have you here. Explore, learn, and unlock your full potential with us",
      bgImage: "/images/Slider1.png",
    },
    {
      title: "LEARN",
      description:
        "Access high-quality learning materials and expert instruction to master new languages",
      bgImage: "/images/Slider2.png",
    },
    {
      title: "SUCCEED",
      description:
        "Prepare for exams with confidence using our targeted practice materials and guidance",
      bgImage: "/images/Slider3.png",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative h-[300px] sm:h-[400px] md:h-[650px] bg-cover bg-center flex items-center justify-center text-white w-full "
      style={{
        backgroundImage: `url(${slides[currentSlide].bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="text-center z-10 px-4 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4  tracking-wider jaini text-large  ">
          {slides[currentSlide].title}
        </h1>
        <p className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-4 sm:mb-8 ubuntu text-middle">
          {slides[currentSlide].description}
        </p>
        <Link to={"/signup"}>
        <button className="bg-custom-blue1 hover:bg-slate-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base ubuntu text-middle">
          Register Now
        </button>
        </Link>

      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-custom-blue1" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
