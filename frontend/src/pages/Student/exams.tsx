import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { fetchExams, fetchExamPhoto } from './services/api';
import { Exam } from './types/exam';
import { AppSidebar } from "./components/sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import LoadingSpinner from './components/LoadingSpinner';

interface ExamWithPhoto extends Exam {
  photoUrl?: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams();
        const examsWithPhotos = await Promise.all(
          data.map(async (exam) => {
            let photoUrl: string | undefined;
            if (exam.photo && exam._id) {
              try {
                photoUrl = await fetchExamPhoto(exam._id);
              } catch (err) {
                console.error(`Failed to load photo for exam ${exam._id}:`, err);
              }
            }
            return { ...exam, photoUrl };
          })
        );
        setExams(examsWithPhotos);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exams');
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  // Function to clear exam-specific localStorage data and navigate to guidelines page
  const startNewExam = (examId: string) => {
    localStorage.removeItem(`exam-${examId}-currentQuestionIndex`);
    localStorage.removeItem(`exam-${examId}-userAnswers`);
    localStorage.removeItem(`exam-${examId}-startTime`);
    // Navigate to the guidelines page with the exam ID
    navigate(`/guidelines/${examId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl text-custom-blue1 jaini">Exams</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-300" />
            </Link>
          </div>
        </header>
        <main className="p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Card key={exam._id || Math.random()} className="overflow-hidden bg-custom-blue5">
                <div className="h-50 overflow-hidden bg-custom-blue5">
                  <img
                    src={exam.photoUrl || "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg"}
                    alt={exam.topic}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvd2s0NDM4ODIwNy1pbWFnZS1rcDZieHUwYy5qcGc.jpg";
                    }}
                  />
                </div>
                <CardContent className="p-0">
                  <h2 className="mb-2 text-center text-xl font-bold text-custom-blue2">{exam.topic}</h2>
                  <p className="text-center ubuntuC font-semibold text-sm text-black">{exam.description}</p>
                </CardContent>
                <CardFooter className="flex justify-center p-4 pt-0">
                  {exam._id ? (
                    <Button
                      onClick={() => startNewExam(exam._id!)}
                      className="bg-custom-blue2 ubuntu hover:bg-[#2d4373] cursor-pointer text-white"
                    >
                      Start Exam
                    </Button>
                  ) : (
                    <p className="text-red-500">Exam ID missing</p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}