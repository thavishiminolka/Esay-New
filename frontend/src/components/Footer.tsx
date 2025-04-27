import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" text-white py-8 px-4 bg-custom-blue1">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <img src="/logo.png" alt="Company Logo" className="h-15 w-auto " />
        </div>
        <div className="hidden md:block h-35 w-px bg-white/30 mx-4"></div>

        <div className="flex flex-col items-center mb-6 md:mb-0">
          <div className="space-y-2 text-center pr-10">
            <div>
              <Link to="/" className="hover:underline ubuntu text-middle ">
                Home
              </Link>{" "}
            </div>
            <div>
              <Link to="/about" className="hover:underline ubuntu text-middle">
                About
              </Link>{" "}
            </div>
            <div>
              <Link
                to="/pricing"
                className="hover:underline ubuntu text-middle"
              >
                Pricing
              </Link>{" "}
            </div>
            <div>
              <Link
                to="/contact"
                className="hover:underline ubuntu text-middle"
              >
                Contact
              </Link>{" "}
            </div>
          </div>
        </div>
        <div className="hidden md:block h-35 w-px bg-white/30 mx-4"></div>
        <div className="text-right">
          <p className="mb-2 ubuntu text-middle">No.78/23</p>
          <p className="mb-2 ubuntu text-middle">Colombo 07</p>
          <p className="mb-4 ubuntu text-middle">011-25879999</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-center text-sm">
        <p>2025. ©All Rights Reserves</p>
      </div>
    </footer>
  );
}

export default Footer;
