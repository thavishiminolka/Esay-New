import { useState, useEffect } from 'react';
import axios from 'axios';

const Applicant = () => {
  const [applicantData, setApplicantData] = useState({
    seatNumber: '7',
    name: '',
    userId: '',
    testRoom: 'Test Room',
    applicationNo: '0012367',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/data', { withCredentials: true });
        setApplicantData({
          ...applicantData,
          name: response.data.name,
          userId: response.data.userId,
        });
      } catch (error) {
        console.error('Failed to fetch applicant data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="p-4 sm:p-6 flex items-center justify-center min-h-20"
      style={{
        backgroundImage: "url('/exam.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg sm:max-w-2xl p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="bg-custom-blue3 p-3 sm:p-4 text-center rounded-t-lg">
          <h1 className="text-white font-serif text-xl sm:text-2xl md:text-3xl">
            Information check of applicant
          </h1>
        </div>

        {/* Information Fields */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start">
          {/* Seat Number (Left Side) */}
          <div className="flex flex-col items-center sm:mr-6 mb-6 sm:mb-0">
            <div className="bg-white border border-gray-300 p-2 rounded text-black text-sm sm:text-base">
              Seat Number
            </div>
            <div className="mt-2 text-black text-6xl sm:text-9xl font-bold">
              {applicantData.seatNumber}
            </div>
          </div>

          {/* Other Fields (Right Side) */}
          <div className="flex-1 space-y-3 sm:space-y-4 w-full">
            {/* Name Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-sm sm:text-base mb-2 sm:mb-0">
                Name
              </div>
              <div className="bg-blue-100 p-2 rounded text-black flex-1 w-full sm:ml-2">
                {applicantData.name}
              </div>
            </div>

            {/* user ID Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-sm sm:text-base mb-2 sm:mb-0">
                user ID
              </div>
              <div className="bg-blue-100 p-2 rounded text-black flex-1 w-full sm:ml-2">
                {applicantData.userId}
              </div>
            </div>

            {/* Test Room Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-sm sm:text-base mb-2 sm:mb-0">
                Test Room
              </div>
              <div className="bg-blue-100 p-2 rounded text-black flex-1 w-full sm:ml-2">
                {applicantData.testRoom}
              </div>
            </div>

            {/* Application No. Field */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-sm sm:text-base mb-2 sm:mb-0">
                Application No.
              </div>
              <div className="bg-blue-100 p-2 rounded text-black flex-1 w-full sm:ml-2">
                {applicantData.applicationNo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicant;