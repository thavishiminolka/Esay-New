
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchExamById } from "./services/api";
import type { Exam, Question } from "./types/exam";
import ExamQuestion from "./components/ExamQuestion";
import ExamTimer from "./components/ExamTimer";
import LoadingSpinner from "./components/LoadingSpinner";
import ExamResult from "./components/ExamResult";
import { ExamDialog } from "./components/exam-dialog";
import { useExamContext } from "../../../contexts/ExamContext";

const ExamPage: React.FC = () => {
  const { examId } = useExamContext();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem(`exam-${examId}-currentQuestionIndex`);
    return saved ? Number.parseInt(saved, 10) : 0;
  });
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>(
    () => {
      const saved = localStorage.getItem(`exam-${examId}-userAnswers`);
      return saved ? JSON.parse(saved) : {};
    }
  );
  const [isFinished, setIsFinished] = useState(() => {
    const saved = localStorage.getItem(`exam-${examId}-isFinished`);
    return saved === "true";
  });
  const [hasSaved, setHasSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingTimeSeconds, setReadingTimeSeconds] = useState<number>(0);
  const [listeningTimeSeconds, setListeningTimeSeconds] = useState<number>(0);
  const [examPhase, setExamPhase] = useState<
    "reading" | "listening" | "finished"
  >(() => {
    const saved = localStorage.getItem(`exam-${examId}-phase`);
    return saved === "listening" ? "listening" : "reading";
  });
  const [startTime, setStartTime] = useState<Date | null>(null); // Added for time tracking

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: "",
    description: "",
    onConfirm: () => {},
    confirmText: "Continue",
    cancelText: "Cancel",
    showCancel: false,
  });

  // Helper function to show dialog
  const showDialog = (
    title: string,
    description: string,
    onConfirm?: () => void,
    confirmText = "Continue",
    cancelText = "Cancel",
    showCancel = false
  ) => {
    setDialogProps({
      title,
      description,
      onConfirm: onConfirm || (() => {}),
      confirmText,
      cancelText,
      showCancel,
    });
    setDialogOpen(true);
  };

  // Set startTime when exam loads
  useEffect(() => {
    if (!startTime && !isFinished) {
      setStartTime(new Date());
    }
  }, [startTime, isFinished]);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        setError("No exam selected");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchExamById(examId);
        console.log("Fetched exam:", data);
        const questionIds = data.questions.map((q: Question) => q._id);
        const uniqueQuestionIds = new Set(questionIds);
        if (questionIds.length !== uniqueQuestionIds.size) {
          console.error("Duplicate question IDs detected:", questionIds);
        }
        data.questions.sort(
          (a: Question, b: Question) => a.questionNumber - b.questionNumber
        );
        setExam(data);
        const readingMinutes = Number.parseInt(
          data.readingTimeMinutes || "0",
          10
        );
        const listeningMinutes = Number.parseInt(
          data.listeningTimeMinutes || "0",
          10
        );
        setReadingTimeSeconds(isNaN(readingMinutes) ? 0 : readingMinutes * 60);
        setListeningTimeSeconds(
          isNaN(listeningMinutes) ? 0 : listeningMinutes * 60
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Failed to load exam");
        setLoading(false);
      }
    };
    loadExam();
  }, [examId]);

  useEffect(() => {
    if (!isFinished && examId && examPhase === "reading") {
      localStorage.setItem(
        `exam-${examId}-currentQuestionIndex`,
        currentQuestionIndex.toString()
      );
    }
  }, [currentQuestionIndex, examId, isFinished, examPhase]);

  useEffect(() => {
    if (!isFinished && examId) {
      localStorage.setItem(
        `exam-${examId}-userAnswers`,
        JSON.stringify(userAnswers)
      );
    }
  }, [userAnswers, examId, isFinished]);

  useEffect(() => {
    if (isFinished && exam && examId) {
      localStorage.setItem(`exam-${examId}-isFinished`, "true");
      localStorage.removeItem(`exam-${examId}-currentQuestionIndex`);
      localStorage.removeItem(`exam-${examId}-userAnswers`);
      localStorage.removeItem(`exam-${examId}-reading-startTime`);
      localStorage.removeItem(`exam-${examId}-listening-startTime`);
      exam.questions.forEach((question: Question) => {
        localStorage.removeItem(
          `question-${question._id || question.questionNumber}-playCount`
        );
      });
    }
  }, [isFinished, examId, exam]);

  useEffect(() => {
    if (examId && examPhase && exam) {
      localStorage.setItem(`exam-${examId}-phase`, examPhase);
      if (examPhase === "listening") {
        const firstListeningIndex = exam.questions.findIndex(
          (q) => q.type === "listening"
        );
        if (
          firstListeningIndex !== -1 &&
          currentQuestionIndex < firstListeningIndex
        ) {
          setCurrentQuestionIndex(firstListeningIndex);
          exam.questions
            .filter((q) => q.type === "listening")
            .forEach((question) => {
              localStorage.removeItem(
                `question-${question._id || question.questionNumber}-playCount`
              );
            });
        }
      }
    }
  }, [examPhase, examId, exam, currentQuestionIndex]);

  // Save result when exam is finished
  useEffect(() => {
    if (isFinished && examId && exam && !hasSaved) {
      const saveResultToDatabase = async () => {
        const questions = exam.questions;
        if (!questions || questions.length === 0) {
          console.log("No questions available to save.");
          showDialog("Error", "No questions available to save.");
          return;
        }

        let score = 0;
        const marksPerQuestion = 5;

        questions.forEach((question) => {
          const userAnswer = userAnswers[question._id!];
          const correctAnswer = question.answers.find((ans) => ans.isCorrect);
          const correctAnswerValue = correctAnswer
            ? correctAnswer.text || correctAnswer.photo || ""
            : "";

          if (!userAnswer || !correctAnswerValue) {
            return;
          }

          const normalizedUserAnswer = userAnswer.trim().toLowerCase();
          const normalizedCorrectAnswer = correctAnswerValue
            .trim()
            .toLowerCase();

          if (normalizedUserAnswer === normalizedCorrectAnswer) {
            score += marksPerQuestion;
          }
        });

        const totalScore = score;
        const totalPossibleMarks = questions.length * 5;
        const percentageScore = Math.round(
          (totalScore / totalPossibleMarks) * 100
        );

        // Validate required fields
        if (!startTime) {
          console.error("Start time is missing");
          showDialog("Error", "Start time is missing. Please restart the exam.");
          return;
        }

        const resultData = {
          examId,
          questions: questions.map((q) => ({
            questionId: q._id!,
            userAnswer: userAnswers[q._id!] || "",
            correctAnswer:
              q.answers.find((ans) => ans.isCorrect)?.text ||
              q.answers.find((ans) => ans.isCorrect)?.photo ||
              "",
            isCorrect:
              userAnswers[q._id!] && q.answers.find((ans) => ans.isCorrect)
                ? userAnswers[q._id!].trim().toLowerCase() ===
                  (
                    q.answers.find((ans) => ans.isCorrect)?.text ||
                    q.answers.find((ans) => ans.isCorrect)?.photo ||
                    ""
                  )
                    .trim()
                    .toLowerCase()
                : false,
          })),
          totalScore,
          totalPossibleMarks,
          percentageScore,
          timestamp: new Date().toISOString(),
          startTime: startTime.toISOString(), // Added startTime
        };

        console.log("Sending result data:", resultData);

        try {
          const response = await fetch("http://localhost:5000/api/results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(resultData),
            credentials: "include",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to save result");
          }

          const data = await response.json();
          console.log("Result saved successfully:", data);
          showDialog(
            "Success",
            `Result saved successfully! Attempt ${data.result.attempt}`,
            () => {}
          );
          setHasSaved(true);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to save result. Please try again.";
          console.error("Error saving result:", error);
          showDialog("Error", errorMessage);
        }
      };

      saveResultToDatabase();
    }
  }, [isFinished, examId, exam, hasSaved, startTime]);

  const handleAnswer = (questionId: string, answer: string) => {
    console.log(`Answer selected for question ${questionId}:`, answer);
    setUserAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      if (examId && !isFinished) {
        localStorage.setItem(
          `exam-${examId}-userAnswers`,
          JSON.stringify(newAnswers)
        );
      }
      return newAnswers;
    });
  };

  const handleReadingTimeComplete = () => {
    if (exam) {
      const firstListeningIndex = exam.questions.findIndex(
        (q) => q.type === "listening"
      );
      if (firstListeningIndex !== -1) {
        setExamPhase("listening");
        setCurrentQuestionIndex(firstListeningIndex);
        localStorage.setItem(`exam-${examId}-phase`, "listening");
        localStorage.setItem(
          `exam-${examId}-listening-startTime`,
          Date.now().toString()
        );
        exam.questions
          .filter((q) => q.type === "listening")
          .forEach((question) => {
            localStorage.removeItem(
              `question-${question._id || question.questionNumber}-playCount`
            );
          });
      } else {
        setExamPhase("finished");
        setIsFinished(true);
      }
    }
  };

  const handleListeningTimeComplete = () => {
    console.log("Listening section time up, navigating to result page");
    setExamPhase("finished");
    setIsFinished(true);
  };

  const handleNext = () => {
    if (!exam) return;
    if (examPhase === "reading") {
      const readingQuestions = exam.questions.filter(
        (q) => q.type === "reading"
      );
      if (readingQuestions.every((q) => userAnswers[q._id!])) {
        showDialog(
          "Proceed to Listening Section",
          "You have completed all reading questions. Are you ready to proceed to the listening section?",
          () => {
            const firstListeningIndex = exam.questions.findIndex(
              (q) => q.type === "listening"
            );
            if (firstListeningIndex !== -1) {
              setExamPhase("listening");
              setCurrentQuestionIndex(firstListeningIndex);
              localStorage.setItem(`exam-${examId}-phase`, "listening");
              localStorage.setItem(
                `exam-${examId}-listening-startTime`,
                Date.now().toString()
              );
            } else {
              setExamPhase("finished");
              setIsFinished(true);
              showDialog(
                "Exam Completed",
                "No listening questions available. Exam completed."
              );
            }
          },
          "Proceed",
          "Stay in Reading",
          true
        );
      } else {
        const nextReadingIndex = exam.questions.findIndex(
          (q, idx) => idx > currentQuestionIndex && q.type === "reading"
        );
        if (nextReadingIndex !== -1) {
          setCurrentQuestionIndex(nextReadingIndex);
        } else {
          showDialog(
            "Reading Section Incomplete",
            "Please answer all reading questions before proceeding."
          );
        }
      }
    }
  };

  const handlePrevious = () => {
    if (!exam || examPhase !== "reading") return;
    if (currentQuestionIndex > 0) {
      let prevIndex = currentQuestionIndex - 1;
      while (prevIndex >= 0 && exam.questions[prevIndex].type !== "reading") {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        setCurrentQuestionIndex(prevIndex);
      }
    }
  };

  const handleQuestionSelect = (index: number) => {
    if (!exam) return;
    const targetQuestion = exam.questions[index];
    if (examPhase === "reading" && targetQuestion.type !== "reading") {
      showDialog(
        "Navigation Restricted",
        "You can only access reading questions during the reading phase."
      );
      return;
    }
    if (examPhase === "listening") {
      showDialog(
        "Navigation Restricted",
        "Navigation is automatic in the listening section."
      );
      return;
    }
    setCurrentQuestionIndex(index);
  };

  const handleAudioComplete = () => {
    if (!exam) return;
    console.log(
      "handleAudioComplete called, currentQuestionIndex:",
      currentQuestionIndex
    );
    const nextListeningIndex = exam.questions.findIndex(
      (q, idx) => idx > currentQuestionIndex && q.type === "listening"
    );
    if (nextListeningIndex !== -1) {
      setCurrentQuestionIndex(nextListeningIndex);
    } else {
      handleListeningTimeComplete();
    }
  };

  const getAnswerIndex = (question: Question): string => {
    const selectedAnswer = userAnswers[question._id!];
    if (!selectedAnswer) return "";
    const answerIndex = question.answers.findIndex(
      (ans) => (ans.text || ans.photo || "") === selectedAnswer
    );
    return answerIndex !== -1 ? (answerIndex + 1).toString() : "";
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Prompt user to save on page unload if not finished
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        !isFinished &&
        examId &&
        exam &&
        Object.keys(userAnswers).length > 0
      ) {
        e.preventDefault();
        e.returnValue =
          "Your exam results will not be saved if you leave. Are you sure?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFinished, examId, exam, userAnswers]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!exam || exam.questions.length === 0)
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-500">
          No Questions Available
        </h2>
        <p className="text-gray-600 mt-2">
          This exam does not contain any questions.
        </p>
        <div className="flex justify-center w-full">
          <button
            className="mt-4 bg-custom-blue2 text-white px-4 py-2 rounded hover:bg-[#2d4373]"
            onClick={() => navigate("/exams")}
          >
            Back to Exams
          </button>
        </div>
      </div>
    );

  if (isFinished) {
    return (
      <div className="container mx-auto p-4">
        <ExamResult
          questions={exam.questions}
          userAnswers={userAnswers}
          examId={examId}
        />
        <Link to="/exams">
          <button className="mt-4 bg-custom-blue2 text-white px-4 py-2 rounded hover:bg-[#2d4373]">
            Back to Exams
          </button>
        </Link>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex] || null;
  const readingQuestions = exam.questions.filter((q) => q.type === "reading");
  const listeningQuestions = exam.questions.filter(
    (q) => q.type === "listening"
  );

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen">
      <ExamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogProps.title}
        description={dialogProps.description}
        onConfirm={dialogProps.onConfirm}
        confirmText={dialogProps.confirmText}
        cancelText={dialogProps.cancelText}
        showCancel={dialogProps.showCancel}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-custom-blue2">{exam.topic}</h1>
          <div className="text-right">
            <div className="flex flex-col gap-1">
              <p className="text-gray-600">
                Duration:{" "}
                {exam.duration.includes(":")
                  ? exam.duration
                  : `${exam.duration}`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                {examPhase === "reading" && (
                  <ExamTimer
                    examId={examId!}
                    examPhase="reading"
                    initialTime={readingTimeSeconds}
                    onTimeUp={handleReadingTimeComplete}
                  />
                )}
                {examPhase === "listening" && (
                  <ExamTimer
                    examId={examId!}
                    examPhase="listening"
                    initialTime={listeningTimeSeconds}
                    onTimeUp={handleListeningTimeComplete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {examPhase === "reading" && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    readingQuestions.length > 0
                      ? (readingQuestions.filter((q) => userAnswers[q._id!])
                          .length /
                          readingQuestions.length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
        {examPhase === "listening" && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    listeningQuestions.length > 0
                      ? (listeningQuestions.filter((q) => userAnswers[q._id!])
                          .length /
                          listeningQuestions.length) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
        <div className="flex-1 bg-white rounded-lg border border-gray-300 p-6 lg:p-8">
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Question{" "}
              {currentQuestion?.questionNumber || currentQuestionIndex + 1} of{" "}
              {exam.questions.length}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({currentQuestion?.type === "reading" ? "Reading" : "Listening"}{" "}
                Section)
              </span>
            </h2>
            {currentQuestion && (
              <ExamQuestion
                question={currentQuestion}
                onAnswer={(answer) =>
                  handleAnswer(currentQuestion._id!, answer)
                }
                selectedAnswer={userAnswers[currentQuestion._id!] || null}
                questionIndex={currentQuestionIndex}
                onAudioComplete={handleAudioComplete}
                maxAudioPlays={2}
                examPhase={examPhase}
              />
            )}
          </div>
          {examPhase === "reading" && (
            <div className="flex justify-between mt-6">
              <button
                className="border border-custom-blue2 text-custom-blue2 px-4 py-2 rounded hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                className="bg-custom-blue2 text-white px-4 py-2 rounded hover:bg-[#2d4373] disabled:bg-[#90abe5] disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={!userAnswers[currentQuestion?._id!]}
              >
                {readingQuestions.every((q) => userAnswers[q._id!])
                  ? "Proceed to Listening"
                  : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 xl:w-96 bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Question Navigator
          </h3>

          <div className="mb-6">
            <div className="bg-gray-100 rounded-md p-3 mb-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-700">Reading Section</h4>
                <p className="text-sm text-blue-600">
                  Time: {formatTime(readingTimeSeconds)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2 mt-2">
                <div className="text-sm font-medium text-gray-600">
                  Question
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Your Answer
                </div>
              </div>
              <div className="space-y-3">
                {readingQuestions.map((question) => {
                  const questionIndex = exam.questions.findIndex(
                    (q) => q._id === question._id
                  );
                  const hasAnswer = !!userAnswers[question._id!];
                  return (
                    <div
                      key={question._id || questionIndex}
                      className="grid grid-cols-2 gap-x-4 items-center"
                    >
                      <button
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                          currentQuestionIndex === questionIndex
                            ? "bg-blue-500 text-white"
                            : hasAnswer
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => handleQuestionSelect(questionIndex)}
                        disabled={examPhase !== "reading"}
                      >
                        Q{question.questionNumber || questionIndex + 1}
                      </button>
                      <div
                        className={`py-2 px-3 rounded-md text-center ${
                          hasAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {getAnswerIndex(question) || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-100 rounded-md p-3 mb-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-700">
                  Listening Section
                </h4>
                <p className="text-sm text-green-600">
                  Time: {formatTime(listeningTimeSeconds)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2 mt-2">
                <div className="text-sm font-medium text-gray-600">
                  Question
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Your Answer
                </div>
              </div>
              <div className="space-y-3">
                {listeningQuestions.map((question) => {
                  const questionIndex = exam.questions.findIndex(
                    (q) => q._id === question._id
                  );
                  const hasAnswer = !!userAnswers[question._id!];
                  return (
                    <div
                      key={question._id || questionIndex}
                      className="grid grid-cols-2 gap-x-4 items-center"
                    >
                      <div
                        className={`py-2 px-3 rounded-md text-sm font-medium ${
                          currentQuestionIndex === questionIndex
                            ? "bg-custom-blue2 text-white"
                            : hasAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Q{question.questionNumber || questionIndex + 1}
                      </div>
                      <div
                        className={`py-2 px-3 rounded-md text-center ${
                          hasAnswer
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {getAnswerIndex(question) || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-md p-3 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Progress</h4>
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div
                  className="bg-custom-blue2 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (Object.keys(userAnswers).length /
                        exam.questions.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {Object.keys(userAnswers).length}/{exam.questions.length}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {Object.keys(userAnswers).length === exam.questions.length
                ? "All questions answered!"
                : `${
                    exam.questions.length - Object.keys(userAnswers).length
                  } questions remaining`}
            </p>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 rounded-md p-4 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-2">Exam Summary</h4>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Total Questions:</span>{" "}
            {exam.questions.length}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Answered:</span>{" "}
            {Object.keys(userAnswers).length}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Current:</span> Question{" "}
            {currentQuestionIndex + 1}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;