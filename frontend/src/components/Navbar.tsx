import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { checkAuth, logout } from "../utils/auth";
import { api } from "../utils/auth";

interface UserData {
  name: string;
  email: string;
  isVerified: boolean;
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [examsDropdownOpen, setExamsDropdownOpen] = useState(false);
  // const [mobileExamsDropdownOpen, setMobileExamsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // const [canAccessExam, setCanAccessExam] = useState(false); // New state for exam access
  // const dropdownRef = useRef<HTMLDivElement>(null);
  // const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status, fetch user data, and check exam access
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const isAuth = await checkAuth();
        console.log("checkAuth result:", isAuth); // Debug log
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          fetchUserData();
          // Check exam access
          const accessResponse = await api.get("/api/auth/check-access");
          console.log("checkAccess result:", accessResponse.data); // Debug log
          // setCanAccessExam(accessResponse.data.canAccessExam || false);
        } else {
          setUserData(null); // Clear user data if not authenticated
          // setCanAccessExam(false); // Clear exam access
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUserData(null);
        // setCanAccessExam(false);
      }
    };
    
    fetchAuthStatus();
  }, [location.pathname]); // Re-run on route changes

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/auth/is-auth");
      console.log("User data response:", response.data); // Debug log
      setUserData(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(null);
    }
  };

  const handleLogout = async () => {
    try {
      const success = await logout();
      console.log("Logout success:", success); // Debug log
      if (success) {
        setIsAuthenticated(false);
        setUserData(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      //   setExamsDropdownOpen(false);
      // }
      // if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
      //   setMobileExamsDropdownOpen(false);
      // }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const toggleExamsDropdown = () => setExamsDropdownOpen(!examsDropdownOpen);
  // const toggleMobileExamsDropdown = () => setMobileExamsDropdownOpen(!mobileExamsDropdownOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const closeAllDropdowns = () => {
    // setExamsDropdownOpen(false);
    // setMobileExamsDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getNameInitial = () => {
    if (userData && userData.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <nav className="text-white p-4 flex items-center justify-between bg-custom-blue1 relative z-50">
        <div className="flex items-center gap-8">
          <img src="/logo.png" alt="Company Logo" className="h-10 w-auto" />
          <div className="hidden md:flex items-center space-x-15 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="hover:text-slate-300 ubuntu text-middle" onClick={closeAllDropdowns}>
              Home
            </Link>
            <Link to="/about" className="hover:text-slate-300 ubuntu text-middle" onClick={closeAllDropdowns}>
              About
            </Link>
            <Link to="/exams" className="hover:text-slate-300 ubuntu text-middle" onClick={closeAllDropdowns}>
              Exams
            </Link>
            <Link to="/pricing" className="hover:text-slate-300 ubuntu text-middle" onClick={closeAllDropdowns}>
              Pricing
            </Link>
            <Link to="/contact" className="hover:text-slate-300 ubuntu text-middle" onClick={closeAllDropdowns}>
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                className="bg-custom-blue4 text-black w-10 h-10 rounded-full hover:bg-slate-100 transition ubuntu flex items-center justify-center text-middle font-medium"
                onClick={toggleUserDropdown}
              >
                {getNameInitial()}
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
                  <Link to="/email-verify" className="block px-4 py-2 hover:bg-gray-100 ubuntu" onClick={closeAllDropdowns}>
                   
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 ubuntu"
                    onClick={() => {
                      handleLogout();
                      closeAllDropdowns();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-custom-blue4 text-black px-6 py-1.5 rounded-full hover:bg-slate-100 transition ubuntu text-middle"
            >
              Login
            </Link>
          )}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-slate-700 text-white p-4 relative z-50`}>
        <div className="flex flex-col space-y-3">
          <Link to="/" className="hover:text-slate-300" onClick={closeAllDropdowns}>
            Home
          </Link>
          <Link to="/about" className="hover:text-slate-300" onClick={closeAllDropdowns}>
            About
          </Link>
          <Link to="/exams" className="hover:text-slate-300" onClick={closeAllDropdowns}>
            Exams
          </Link>

          <Link to="/pricing" className="hover:text-slate-300" onClick={closeAllDropdowns}>
            Pricing
          </Link>
          <Link to="/contact" className="hover:text-slate-300" onClick={closeAllDropdowns}>
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <div className="border-t border-gray-600 pt-2 mt-2"></div>
              <Link to="/email-verify" className="hover:text-slate-300" onClick={closeAllDropdowns}>
               
              </Link>
              <button
                className="text-left hover:text-slate-300"
                onClick={() => {
                  handleLogout();
                  closeAllDropdowns();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;