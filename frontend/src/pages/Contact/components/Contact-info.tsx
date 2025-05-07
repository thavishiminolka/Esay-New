import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const ContactForm = () => {
  return (
    <div className="flex-grow bg-[url('/images/bg3.png')] bg-cover bg-center bg-no-repeat relative min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12">
            We will reach you soon!
          </p>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Contact Info */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1d3e5a] mb-4">
                Let's talk with us
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                Questions, comments, or suggestions? Simply fill in the form and
                we'll be in touch shortly.
              </p>

              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-700">
                <h2 className="font-bold">+94 70 407 6452</h2>
                <p className="font-bold">info@epstoicsir.com</p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="https://www.instagram.com/your_instagram_handle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1d3e5a] hover:text-[#e1306c] transition-colors"
                  aria-label="Visit our Instagram page"
                >
                  <FaInstagram className="text-3xl sm:text-4xl" />
                </a>
                <a
                  href="https://www.facebook.com/your_facebook_page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1d3e5a] hover:text-[#1877f2] transition-colors"
                  aria-label="Visit our Facebook page"
                >
                  <FaFacebookF className="text-3xl sm:text-4xl" />
                </a>
                <a
                  href="https://www.x.com/your_x_handle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1d3e5a] hover:text-[#000000] transition-colors"
                  aria-label="Visit our X page"
                >
                  <FaTwitter className="text-3xl sm:text-4xl" />
                </a>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:w-2/3">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <form className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d3e5a] text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d3e5a] text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="Contact Number"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d3e5a] text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d3e5a] text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows={3}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d3e5a] text-sm sm:text-base"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 sm:px-6 py-1.5 sm:py-2 bg-[#2d3e59] text-white rounded-md hover:bg-[#1d2e49] transition-colors text-sm sm:text-base"
                      aria-label="Send message"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
