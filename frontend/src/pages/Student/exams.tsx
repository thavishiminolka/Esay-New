// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { fetchExams, fetchExamPhoto } from './services/api';
// import { Exam } from './types/exam';
// import { AppSidebar } from "./components/sidebar";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
// import LoadingSpinner from './components/LoadingSpinner';

// interface ExamWithPhoto extends Exam {
//   photoUrl?: string;
// }

// export default function ExamsPage() {
//   const [exams, setExams] = useState<ExamWithPhoto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadExams = async () => {
//       try {
//         const data = await fetchExams();
//         const examsWithPhotos = await Promise.all(
//           data.map(async (exam) => {
//             let photoUrl: string | undefined;
//             if (exam.photo && exam._id) {
//               try {
//                 photoUrl = await fetchExamPhoto(exam._id);
//               } catch (err) {
//                 console.error(`Failed to load photo for exam ${exam._id}:`, err);
//               }
//             }
//             return { ...exam, photoUrl };
//           })
//         );
//         setExams(examsWithPhotos);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load exams');
//         setLoading(false);
//       }
//     };
//     loadExams();
//   }, []);

//   // Function to clear exam-specific localStorage data and navigate to guidelines page
//   const startNewExam = (examId: string) => {
//     localStorage.removeItem(`exam-${examId}-currentQuestionIndex`);
//     localStorage.removeItem(`exam-${examId}-userAnswers`);
//     localStorage.removeItem(`exam-${examId}-startTime`);
//     // Navigate to the guidelines page with the exam ID
//     navigate(`/guidelines/${examId}`);
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl text-custom-blue1 jaini">Exams</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {exams.map((exam) => (
//               <Card key={exam._id || Math.random()} className="overflow-hidden bg-custom-blue5">
//                 <div className="h-50 overflow-hidden bg-custom-blue5">
//                   <img
//                     src={exam.photoUrl || "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg"}
//                     alt={exam.topic}
//                     className="h-full w-full object-cover object-top"
//                     onError={(e) => {
//                       e.currentTarget.src = "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg";
//                     }}
//                   />
//                 </div>
//                 <CardContent className="p-0">
//                   <h2 className="mb-2 text-center text-xl font-bold text-custom-blue2">{exam.topic}</h2>
//                   <p className="text-center ubuntuC font-semibold text-sm text-black">{exam.description}</p>
//                 </CardContent>
//                 <CardFooter className="flex justify-center p-4 pt-0">
//                   {exam._id ? (
//                     <Button
//                       onClick={() => startNewExam(exam._id!)}
//                       className="bg-custom-blue2 ubuntu hover:bg-[#2d4373] cursor-pointer text-white"
//                     >
//                       Start Exam
//                     </Button>
//                   ) : (
//                     <p className="text-red-500">Exam ID missing</p>
//                   )}
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

//-------------------------------------------------

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchExams, fetchExamPhoto } from "./services/api";
// import { Exam } from "./types/exam";
// import { AppSidebar } from "./components/sidebar";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import LoadingSpinner from "./components/LoadingSpinner";

// interface ExamWithPhoto extends Exam {
//   photoUrl?: string;
// }

// export default function ExamsPage() {
//   const [exams, setExams] = useState<ExamWithPhoto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadExams = async () => {
//       try {
//         const data = await fetchExams();
//         const examsWithPhotos = await Promise.all(
//           data.map(async (exam) => {
//             let photoUrl: string | undefined;
//             if (exam.photo && exam._id) {
//               try {
//                 photoUrl = await fetchExamPhoto(exam._id);
//               } catch (err) {
//                 console.error(
//                   `Failed to load photo for exam ${exam._id}:`,
//                   err
//                 );
//               }
//             }
//             return { ...exam, photoUrl };
//           })
//         );
//         setExams(examsWithPhotos);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load exams");
//         setLoading(false);
//       }
//     };
//     loadExams();
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl text-custom-blue1 jaini">Exams</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {exams.map((exam) => (
//               <Card
//                 key={exam._id || Math.random()}
//                 className="overflow-hidden bg-custom-blue5 relative"
//               >
//                 <div className="h-50 overflow-hidden bg-custom-blue5">
//                   <img
//                     src={
//                       exam.photoUrl ||
//                       "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg"
//                     }
//                     alt={exam.topic}
//                     className="h-full w-full object-cover object-top"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg";
//                     }}
//                   />
//                 </div>
//                 <CardContent className="p-0">
//                   <h2 className="mb-2 text-center text-xl font-bold text-custom-blue2">
//                     {exam.topic}
//                   </h2>
//                   <p className="text-center ubuntuC font-semibold text-sm text-black">
//                     {exam.description}
//                   </p>
//                 </CardContent>
//                 <CardFooter className="flex justify-center p-4 pt-0">
//                   {exam._id ? (
//                     <Button
//                       disabled
//                       className="bg-gray-400 ubuntu text-white cursor-not-allowed"
//                       aria-label={`Exam ${exam.topic} is locked`}
//                     >
//                       Locked
//                     </Button>
//                   ) : (
//                     <p className="text-red-500">Exam ID missing</p>
//                   )}
//                 </CardFooter>
//                 <div className="absolute inset-0 flex items-center justify-center bg-grey bg-opacity-30">
//                   <span className="text-white text-lg font-semibold">
//                     Exam Locked
//                   </span>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

//--------------------------------------------------

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchExams, fetchExamPhoto } from "./services/api";
// import { Exam } from "./types/exam";
// import { AppSidebar } from "./components/sidebar";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import LoadingSpinner from "./components/LoadingSpinner";

// interface ExamWithPhoto extends Exam {
//   photoUrl?: string;
// }

// export default function ExamsPage() {
//   const [exams, setExams] = useState<ExamWithPhoto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadExams = async () => {
//       try {
//         // Fetch exams (already filtered by backend based on active user plans)
//         const data = await fetchExams();
//         console.log("Fetched exams:", data);

//         const examsWithPhotos = await Promise.all(
//           data.map(async (exam) => {
//             let photoUrl: string | undefined;
//             if (exam.photo && exam._id) {
//               try {
//                 photoUrl = await fetchExamPhoto(exam._id);
//               } catch (err) {
//                 console.error(
//                   `Failed to load photo for exam ${exam._id}:`,
//                   err
//                 );
//               }
//             }
//             return { ...exam, photoUrl };
//           })
//         );
//         setExams(examsWithPhotos);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load exams");
//         setLoading(false);
//         console.error("Error loading exams:", err);
//       }
//     };
//     loadExams();
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl text-custom-blue1 jaini">Exams</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {exams.map((exam) => (
//               <Card
//                 key={exam._id || Math.random()}
//                 className="overflow-hidden bg-custom-blue5 relative"
//               >
//                 <div className="h-50 overflow-hidden bg-custom-blue5">
//                   <img
//                     src={
//                       exam.photoUrl ||
//                       "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg"
//                     }
//                     alt={exam.topic}
//                     className="h-full w-full object-cover object-top"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg";
//                     }}
//                   />
//                 </div>
//                 <CardContent className="p-0">
//                   <h2 className="mb-2 text-center text-xl font-bold text-custom-blue2">
//                     {exam.topic}
//                   </h2>
//                   <p className="text-center ubuntuC font-semibold text-sm text-black">
//                     {exam.description}
//                   </p>
//                 </CardContent>
//                 <CardFooter className="flex justify-center p-4 pt-0">
//                   {exam._id ? (
//                     <Button
//                       asChild
//                       className="bg-custom-blue1 text-white hover:bg-blue-950"
//                       aria-label={`View guidelines for ${exam.topic}`}
//                     >
//                       <Link to={`/guidelines/${exam._id}`}>Take Exam</Link>
//                     </Button>
//                   ) : (
//                     <p className="text-red-500">Exam ID missing</p>
//                   )}
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// //updated
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchExams, fetchExamPhoto } from "./services/api";
// import { Exam } from "./types/exam";
// import { AppSidebar } from "./components/sidebar";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";
// import LoadingSpinner from "./components/LoadingSpinner";
// import { useExamContext } from "../../../contexts/ExamContext";

// interface ExamWithPhoto extends Exam {
//   photoUrl?: string;
// }

// export default function ExamsPage() {
//   const [exams, setExams] = useState<ExamWithPhoto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { setExamId } = useExamContext();

//   useEffect(() => {
//     const loadExams = async () => {
//       try {
//         // Fetch exams (already filtered by backend based on active user plans)
//         const data = await fetchExams();
//         console.log("Fetched exams:", data);

//         const examsWithPhotos = await Promise.all(
//           data.map(async (exam) => {
//             let photoUrl: string | undefined;
//             if (exam.photo && exam._id) {
//               try {
//                 photoUrl = await fetchExamPhoto(exam._id);
//               } catch (err) {
//                 console.error(
//                   `Failed to load photo for exam ${exam._id}:`,
//                   err
//                 );
//               }
//             }
//             return { ...exam, photoUrl };
//           })
//         );
//         setExams(examsWithPhotos);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load exams");
//         setLoading(false);
//         console.error("Error loading exams:", err);
//       }
//     };
//     loadExams();
//   }, []);

//   const handleTakeExam = (examId: string) => {
//     setExamId(examId);
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl text-custom-blue1 jaini">Exams</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {exams.map((exam) => (
//               <Card
//                 key={exam._id || Math.random()}
//                 className="overflow-hidden bg-custom-blue5 relative"
//               >
//                 <div className="h-50 overflow-hidden bg-custom-blue5">
//                   <img
//                     src={
//                       exam.photoUrl ||
//                       "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg"
//                     }
//                     alt={exam.topic}
//                     className="h-full w-full object-cover object-top"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg";
//                     }}
//                   />
//                 </div>
//                 <CardContent className="p-0">
//                   <h2 className="mb-2 text-center text-xl font-bold text-custom-blue2">
//                     {exam.topic}
//                   </h2>
//                   <p className="text-center ubuntuC font-semibold text-sm text-black">
//                     {exam.description}
//                   </p>
//                 </CardContent>
//                 <CardFooter className="flex justify-center p-4 pt-0">
//                   {exam._id ? (
//                     <Button
//                       asChild
//                       className="bg-custom-blue1 text-white hover:bg-blue-950"
//                       aria-label={`View guidelines for ${exam.topic}`}
//                     >
//                       <Link
//                         to="/guidelines"
//                         onClick={() => handleTakeExam(exam._id)}
//                       >
//                         Take Exam
//                       </Link>
//                     </Button>
//                   ) : (
//                     <p className="text-red-500">Exam ID missing</p>
//                   )}
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

//alll fixed
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useExamContext } from "../../../contexts/ExamContext";
import defaultExamImage from "../../assets/default-exam.jpg"; // Adjust path as needed
import { Button } from "../../components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { AppSidebar } from "./components/sidebar";

interface Exam {
  id: string;
  language: string;
  topic: string;
  description: string;
  duration: string;
  readingTimeMinutes: string;
  listeningTimeMinutes: string;
  guidelines: string[];
  questions: {
    questionNumber: number;
    type: string;
    questionText: string;
    questionPhoto?: string;
    answers: { text: string; photo?: string; isCorrect: boolean }[];
    audio?: string;
  }[];
  photo?: string;
}

export default function Exams() {
  const navigate = useNavigate();
  const { setExamId } = useExamContext();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams", {
          credentials: "include", // Send JWT token via cookies
        });
        if (!response.ok) {
          throw new Error(`Failed to load exams: ${response.statusText}`);
        }
        const data = await response.json();
        const formattedData = data.map((exam: any) => ({
          ...exam,
          id: exam._id.toString(),
        }));
        console.log("Fetched exams:", formattedData);
        setExams(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleTakeExam = (exam: Exam) => {
    if (!exam.id) {
      alert("Invalid exam ID");
      return;
    }
    setExamId(exam.id);
    navigate("/guidelines");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl text-custom-blue1 jaini">
              Available Exams
            </h1>
          </div>
          {/* <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div> */}
        </header>
        <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          {loading ? (
            <div className="text-center text-gray-600">Loading exams...</div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center text-gray-600">
              No exams available. Please purchase a plan to access exams.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4"
                >
                  <img
                    src={
                      exam.photo
                        ? `http://localhost:5000${exam.photo}`
                        : defaultExamImage
                    }
                    alt={exam.topic}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = defaultExamImage;
                    }}
                  />
                  <h2 className="text-xl font-semibold">{exam.topic}</h2>
                  <p className="text-gray-600">{exam.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Duration: {exam.duration}
                    </p>
                    <Button
                      onClick={() => handleTakeExam(exam)}
                      className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md"
                    >
                      Take Exam
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
