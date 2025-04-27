import AdvertisementSection from "./components/Advertisement-section";
import FeaturesSection from "./components/Feature-section";
import FeedbackSection from "./components/Feedback-section";
import Footer from "../../components/Footer";
import HeroSection from "./components/Hero-section";
import LanguageOptions from "./components/Language-options";

import Navbar from "../../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="bg-color">
        <div
          className="bg-cover bg-center bg-no-repeat  "
          style={{
            backgroundImage: "url('/images/bg1.png')",
            backgroundSize: "90% auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "90% 10%",
            // backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >
          <HeroSection />
          <br />
          <LanguageOptions />
          <br />
          <FeaturesSection />

          <div
            style={{
              backgroundImage: "url('/images/bg2.png')",
              backgroundSize: "90% auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              minHeight: "100vh",
            }}
          >
            <AdvertisementSection />
            <FeedbackSection />
            <br />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
