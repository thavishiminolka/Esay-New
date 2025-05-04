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
    className="p-5 flex  items-center justify-center"
    style={{
      backgroundImage: "url('/exam.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Rest of your content */}
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="bg-custom-blue3 p-4 text-center rounded-t-lg">
          <h1 className="text-white font-serif text-3xl">Information check of applicant</h1>
        </div>

        {/* Information Fields */}
        <div className="mt-6 flex items-start">
          {/* Seat Number (Left Side) */}
          <div className="flex flex-col items-center mr-6">
            <div className="bg-white border border-gray-300 p-2 rounded text-black text-base">
              Seat Number
            </div>
            <div className="mt-2 text-black text-9xl font-bold">
              {applicantData.seatNumber}
            </div>
          </div>

          {/* Other Fields (Right Side) */}
          <div className="flex-1 space-y-4">
            {/* Name Field */}
            <div className="flex items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-base">
                Name
              </div>
              <div className="bg-blue-100 p-2 rounded text-black ml-2 flex-1">
                {applicantData.name}
              </div>
            </div>

            {/* user ID Field */}
            <div className="flex items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-base">
                user ID
              </div>
              <div className="bg-blue-100 p-2 rounded text-black ml-2 flex-1">
                {applicantData.userId}
              </div>
            </div>

            {/* Test Room Field */}
            <div className="flex items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-base">
                Test Room
              </div>
              <div className="bg-blue-100 p-2 rounded text-black ml-2 flex-1">
                {applicantData.testRoom}
              </div>
            </div>

            {/* Application No. Field */}
            <div className="flex items-center">
              <div className="bg-white border border-gray-300 p-2 rounded text-black w-32 text-base ">
                Application No.
              </div>
              <div className="bg-blue-100 p-2 rounded text-black ml-2 flex-1">
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