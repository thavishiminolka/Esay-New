// import { useState, useEffect } from "react";
// import { ChevronLeft } from "lucide-react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { Button } from "../../components/ui/button";
// import { fetchExamById } from "./services/api";
// import { Exam } from "./types/exam";

// export default function GuidelinesPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [exam, setExam] = useState<Exam | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadExam = async () => {
//       if (!id) {
//         setError("Exam ID is missing in the URL");
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log("Fetching exam with ID:", id);
//         const data = await fetchExamById(id);
//         console.log("Fetched exam data:", data);

//         if (!data._id) {
//           throw new Error("Exam ID is missing in the response");
//         }

//         if (!data.guidelines) {
//           console.warn(
//             "Guidelines field is missing or undefined in the response"
//           );
//           data.guidelines = [];
//         }

//         console.log("Guidelines:", data.guidelines);

//         setExam(data);
//         setLoading(false);
//       } catch (err: any) {
//         const errorMessage = err.message || "Failed to load exam guidelines";
//         setError(errorMessage);
//         setLoading(false);
//         console.error("Error fetching exam:", err);
//       }
//     };
//     loadExam();
//   }, [id]);

//   const startExam = () => {
//     if (!id) {
//       console.error("Cannot start exam: Exam ID is missing");
//       return;
//     }

//     console.log(
//       "Starting new exam, clearing all previous state for exam ID:",
//       id
//     );

//     // Clear all relevant localStorage keys to ensure a fresh exam
//     const keysToRemove = [
//       `exam-${id}-currentQuestionIndex`,
//       `exam-${id}-userAnswers`,
//       `exam-${id}-isFinished`,
//       `exam-${id}-phase`,
//       `exam-${id}-reading-startTime`,
//       `exam-${id}-listening-startTime`,
//       `exam-${id}-startTime`, // Remove in case used elsewhere
//     ];

//     keysToRemove.forEach((key) => {
//       localStorage.removeItem(key);
//       console.log(`Removed localStorage key: ${key}`);
//     });

//     // Clear audio play count keys for all questions
//     if (exam && exam.questions) {
//       exam.questions.forEach((question) => {
//         const questionKey = `question-${
//           question._id || question.questionNumber
//         }-playCount`;
//         localStorage.removeItem(questionKey);
//         console.log(`Removed localStorage key: ${questionKey}`);
//       });
//     }

//     console.log("Navigating to exam page: /quiz/", id);
//     navigate(`/quiz/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-main flex flex-col">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center">
//             <Link to="/exams" className="flex items-center text-custom-blue1">
//               <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
//             </Link>
//             <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
//               <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
//                 Loading Guidelines...
//               </h2>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error || !exam) {
//     return (
//       <div className="min-h-screen bg-main flex flex-col">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center">
//             <Link to="/exams" className="flex items-center text-custom-blue1">
//               <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
//             </Link>
//             <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Username</span>
//             <Link to="/profile" className="cursor-pointer">
//               <div className="h-10 w-10 rounded-full bg-gray-300" />
//             </Link>
//           </div>
//         </header>
//         <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
//           <div className="max-w-4xl mx-auto">
//             <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
//               <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
//                 {error || "Exam not found"}
//               </h2>
//             </div>
//             <div className="flex justify-center">
//               <Button className="px-10 py-6 text-white text-lg bg-custom-blue2 hover:bg-[#2d4373] cursor-pointer">
//                 <Link to="/exams">Back to Exams</Link>
//               </Button>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-main flex flex-col">
//       <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//         <div className="flex items-center">
//           <Link to="/exams" className="flex items-center text-custom-blue1">
//             <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
//           </Link>
//           <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
//         </div>
//         <div className="flex items-center gap-6 pr-7">
//           <span className="text-custom-blue2">Username</span>
//           <Link to="/profile" className="cursor-pointer">
//             <div className="h-10 w-10 rounded-full bg-gray-300" />
//           </Link>
//         </div>
//       </header>
//       <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
//             <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
//               Guidelines for the {exam.topic} Exam
//             </h2>
//             {exam.guidelines && exam.guidelines.length > 0 ? (
//               <div className="space-y-6">
//                 {exam.guidelines.map((guideline, index) => {
//                   const points = guideline
//                     .split(/[\n;]+/)
//                     .filter((point) => point.trim() !== "");
//                   return (
//                     <div key={index}>
//                       <h3 className="text-lg font-medium text-[#1a3a54] mb-2">
//                         Guideline {index + 1}
//                       </h3>
//                       <ul className="list-disc pl-6 space-y-1 text-[#1a3a54]">
//                         {points.map((point, pointIndex) => (
//                           <li key={pointIndex}>{point.trim()}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-center text-[#1a3a54]">
//                 No guidelines available for this exam.
//               </p>
//             )}
//           </div>
//           <div className="flex justify-center">
//             <Button
//               onClick={startExam}
//               className="px-10 py-6 text-white text-lg bg-custom-blue2 hover:bg-[#2d4373] cursor-pointer"
//             >
//               Start Exam
//             </Button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// //updated

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { fetchExamById } from "./services/api";
import { Exam } from "./types/exam";
import { useExamContext } from "../../../contexts/ExamContext";

export default function GuidelinesPage() {
  const { examId } = useExamContext();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        setError("No exam selected");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching exam with ID:", examId);
        const data = await fetchExamById(examId);
        console.log("Fetched exam data:", data);

        if (!data._id) {
          throw new Error("Exam ID is missing in the response");
        }

        if (!data.guidelines) {
          console.warn(
            "Guidelines field is missing or undefined in the response"
          );
          data.guidelines = [];
        }

        console.log("Guidelines:", data.guidelines);

        setExam(data);
        setLoading(false);
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load exam guidelines";
        setError(errorMessage);
        setLoading(false);
        console.error("Error fetching exam:", err);
      }
    };
    loadExam();
  }, [examId]);

  const startExam = () => {
    if (!examId) {
      console.error("Cannot start exam: Exam ID is missing");
      return;
    }

    console.log(
      "Starting new exam, clearing all previous state for exam ID:",
      examId
    );

    // Clear all relevant localStorage keys to ensure a fresh exam
    const keysToRemove = [
      `exam-${examId}-currentQuestionIndex`,
      `exam-${examId}-userAnswers`,
      `exam-${examId}-isFinished`,
      `exam-${examId}-phase`,
      `exam-${examId}-reading-startTime`,
      `exam-${examId}-listening-startTime`,
      `exam-${examId}-startTime`, // Remove in case used elsewhere
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
    });

    // Clear audio play count keys for all questions
    if (exam && exam.questions) {
      exam.questions.forEach((question) => {
        const questionKey = `question-${
          question._id || question.questionNumber
        }-playCount`;
        localStorage.removeItem(questionKey);
        console.log(`Removed localStorage key: ${questionKey}`);
      });
    }

    console.log("Navigating to exam page: /quiz");
    navigate(`/quiz`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <Link to="/exams" className="flex items-center text-custom-blue1">
              <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
            <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
                Loading Guidelines...
              </h2>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-main flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <Link to="/exams" className="flex items-center text-custom-blue1">
              <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
            </Link>
            <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
                {error || "Exam not found"}
              </h2>
            </div>
            <div className="flex justify-center">
              <Button className="px-10 py-6 text-white text-lg bg-custom-blue2 hover:bg-[#2d4373] cursor-pointer">
                <Link to="/exams">Back to Exams</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main flex flex-col">
      <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Link to="/exams" className="flex items-center text-custom-blue1">
            <ChevronLeft className="mt-1 ml-3 h-7 w-5 cursor-pointer" />
          </Link>
          <h1 className="text-4xl ml-4 text-custom-blue1 jaini">Guideline</h1>
        </div>
        <div className="flex items-center gap-6 pr-7">
          <span className="text-custom-blue2">Username</span>
          <Link to="/profile" className="cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </Link>
        </div>
      </header>
      <main className="p-6 overflow-y-auto flex-1 mt-10 mx-10 rounded-2xl bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#d6e4ed] rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-center text-[#1a3a54] mb-8">
              Guidelines for the {exam.topic} Exam
            </h2>
            {exam.guidelines && exam.guidelines.length > 0 ? (
              <div className="space-y-6">
                {exam.guidelines.map((guideline, index) => {
                  const points = guideline
                    .split(/[\n;]+/)
                    .filter((point) => point.trim() !== "");
                  return (
                    <div key={index}>
                      <h3 className="text-lg font-medium text-[#1a3a54] mb-2">
                        Guideline {index + 1}
                      </h3>
                      <ul className="list-disc pl-6 space-y-1 text-[#1a3a54]">
                        {points.map((point, pointIndex) => (
                          <li key={pointIndex}>{point.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[#1a3a54]">
                No guidelines available for this exam.
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={startExam}
              className="px-10 py-6 text-white text-lg bg-custom-blue2 hover:bg-[#2d4373] cursor-pointer"
            >
              Start Exam
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
