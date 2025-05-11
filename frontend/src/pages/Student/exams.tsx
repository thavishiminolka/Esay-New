
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/exams`, {
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
                        ? `${apiUrl}${exam.photo}`
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
