
//-------------------------------newwwww
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Edit, Trash2 } from "lucide-react";

// Import default image
import defaultExamImage from "../../assets/default-exam.jpg"; // Adjust path as needed

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

export default function ViewExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  // useEffect(() => {
  //   const fetchExams = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/admin/exams");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch exams");
  //       }
  //       const data = await response.json();
  //       // Ensure id is a string
  //       const formattedData = data.map((exam: any) => ({
  //         ...exam,
  //         id: exam._id.toString(),
  //       }));
  //       setExams(formattedData);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred");
  //     }
  //   };

  //   fetchExams();
  // }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/exams/admin/exams`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch exams");
        }
        const data = await response.json();
        // Ensure id is a string
        const formattedData = data.map((exam: any) => ({
          ...exam,
          id: exam._id.toString(),
        }));
        setExams(formattedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching exams"
        );
      }
    };

    fetchExams();
  }, []);

  const handleEdit = (exam: Exam) => {
    if (!exam.id) {
      alert("Invalid exam ID");
      return;
    }
    navigate("/editExams", { state: { exam } });
  };

  const handleDelete = async (examId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this exam? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/exams/${examId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exam");
      }

      // Remove the deleted exam from state
      setExams(exams.filter((exam) => exam.id !== examId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the exam"
      );
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <div className="flex items-center gap-2">
    
              <h1 className="text-3xl font-bold text-[#1a3a54]">View Exams</h1>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div> */}
        </header>

        <main className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}
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
                />
                <h2 className="text-xl font-semibold">{exam.topic}</h2>
                <p className="text-gray-600">{exam.description}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(exam)}
                    className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(exam.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-md flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
