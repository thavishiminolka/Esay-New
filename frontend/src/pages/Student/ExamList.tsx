import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchExams, fetchExamPhoto } from './services/api';
import { Exam } from './types/exam';
import LoadingSpinner from './components/LoadingSpinner';

interface ExamWithPhoto extends Exam {
  photoUrl?: string;
}

const ExamList: React.FC = () => {
  const [exams, setExams] = useState<ExamWithPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Add useNavigate hook

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

  // Function to clear exam-specific localStorage data
  const startNewExam = (examId: string) => {
    localStorage.removeItem(`exam-${examId}-currentQuestionIndex`);
    localStorage.removeItem(`exam-${examId}-userAnswers`);
    localStorage.removeItem(`exam-${examId}-startTime`);
    // Navigate to the exam page
    navigate(`/exam/${examId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Exams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam._id || Math.random()} className="bg-white p-6 rounded-lg shadow-md">
            {exam.photoUrl && (
              <img
                src={exam.photoUrl}
                alt={exam.topic}
                className="w-full h-40 object-cover rounded mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h2 className="text-xl font-semibold">{exam.topic}</h2>
            <p className="text-gray-600">Language: {exam.language}</p>
            <p className="text-gray-600">Duration: {exam.duration}</p>
            <p className="text-gray-600">{exam.description}</p>
            {exam._id ? (
              <button
                onClick={() => startNewExam(exam._id!)}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Take Exam
              </button>
            ) : (
              <p className="text-red-500 mt-4">Exam ID missing</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList;