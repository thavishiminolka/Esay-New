import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminSidebar } from "./components/adminsidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Upload, X } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

interface Answer {
  text?: string;
  photo?: File | string | null;
  photoPreview?: string | null;
  isCorrect: boolean;
  inputType: "text" | "photo";
}

interface QuestionData {
  type: string;
  questionText?: string;
  questionPhoto?: File | string | null;
  questionPhotoPreview?: string | null;
  questionInputType: "text" | "photo";
  answers: Answer[];
  correctAnswerIndex: number | null;
  audio?: File | string | null;
  audioPreview?: string | null;
}

interface GuidelineTexts {
  [key: number]: string;
}

interface QuestionDataMap {
  [key: number]: QuestionData;
}

interface Exam {
  id: string; // Changed from number to string to match MongoDB _id
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

export default function EditExams() {
  const location = useLocation();
  const navigate = useNavigate();
  const exam: Exam | undefined = location.state?.exam;

  const [guidelines, setGuidelines] = useState<number[]>([]);
  const [questions, setQuestions] = useState<number[]>([]);
  const [language, setLanguage] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [durationHours, setDurationHours] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<string>("");
  const [listeningTimeMinutes, setListeningTimeMinutes] = useState<string>("");
  const [photo, setPhoto] = useState<File | string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [guidelineTexts, setGuidelineTexts] = useState<GuidelineTexts>({});
  const [questionData, setQuestionData] = useState<QuestionDataMap>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const questionPhotoInputRefs = useRef<{
    [key: number]: HTMLInputElement | null;
  }>({});
  const answerPhotoInputRefs = useRef<{
    [key: number]: { [key: number]: HTMLInputElement | null };
  }>({});
  const audioInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    if (!exam || !exam.id) {
      setFormErrors(["No exam data provided. Please select an exam to edit."]);
      navigate("/viewExams");
      return;
    }

    // Initialize state with exam data
    setLanguage(exam.language);
    setTopic(exam.topic);
    setDescription(exam.description);
    setReadingTimeMinutes(exam.readingTimeMinutes);
    setListeningTimeMinutes(exam.listeningTimeMinutes);
    setPhoto(exam.photo || null);
    setPhotoPreview(exam.photo || null);

    // Parse duration
    const [hours, minutes] = exam.duration.split(":").map(Number);
    setDurationHours(hours.toString());
    setDurationMinutes(minutes.toString());

    // Initialize guidelines
    const initialGuidelines = exam.guidelines.map((_, index) => index + 1);
    const initialGuidelineTexts = exam.guidelines.reduce(
      (acc, text, index) => ({ ...acc, [index + 1]: text }),
      {}
    );
    setGuidelines(initialGuidelines);
    setGuidelineTexts(initialGuidelineTexts);

    // Initialize questions
    const initialQuestions = exam.questions.map((q) => q.questionNumber);
    const initialQuestionData = exam.questions.reduce((acc, q) => {
      const answers = q.answers.map((a, _index) => ({
        text: a.text,
        photo: a.photo || null,
        photoPreview: a.photo || null,
        isCorrect: a.isCorrect,
        inputType: a.photo ? "photo" : "text",
      }));
      return {
        ...acc,
        [q.questionNumber]: {
          type: q.type,
          questionText: q.questionText,
          questionPhoto: q.questionPhoto || null,
          questionPhotoPreview: q.questionPhoto || null,
          questionInputType: q.questionPhoto ? "photo" : "text",
          answers,
          correctAnswerIndex:
            q.answers.findIndex((a) => a.isCorrect) + 1 || null,
          audio: q.audio || null,
          audioPreview: q.audio || null,
        },
      };
    }, {});
    setQuestions(initialQuestions);
    setQuestionData(initialQuestionData);
  }, [exam, navigate]);

  // Reuse functions from ScheduleExams for adding/removing guidelines and questions
  const addGuideline = () => {
    const newIndex = guidelines.length > 0 ? Math.max(...guidelines) + 1 : 1;
    setGuidelines([...guidelines, newIndex]);
  };

  const removeGuideline = (index: number) => {
    setGuidelines(guidelines.filter((guideline) => guideline !== index));
    const newGuidelineTexts = { ...guidelineTexts };
    delete newGuidelineTexts[index];
    setGuidelineTexts(newGuidelineTexts);
  };

  const addQuestion = () => {
    const newIndex = questions.length > 0 ? Math.max(...questions) + 1 : 1;
    setQuestions([...questions, newIndex]);
    setQuestionData({
      ...questionData,
      [newIndex]: {
        type: "reading",
        questionInputType: "text",
        questionText: "",
        answers: Array(4)
          .fill({})
          .map(() => ({
            text: "",
            isCorrect: false,
            inputType: "text",
            photo: null,
            photoPreview: null,
          })),
        correctAnswerIndex: null,
      },
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((question) => question !== index));
    const newQuestionData = { ...questionData };
    delete newQuestionData[index];
    setQuestionData(newQuestionData);
  };

  const clearForm = () => {
    if (!exam) return;
    setLanguage(exam.language);
    setTopic(exam.topic);
    setDurationHours(exam.duration.split(":")[0]);
    setDurationMinutes(exam.duration.split(":")[1]);
    setReadingTimeMinutes(exam.readingTimeMinutes);
    setListeningTimeMinutes(exam.listeningTimeMinutes);
    setPhoto(exam.photo || null);
    setPhotoPreview(exam.photo || null);
    setDescription(exam.description);
    setGuidelines(exam.guidelines.map((_, index) => index + 1));
    setGuidelineTexts(
      exam.guidelines.reduce(
        (acc, text, index) => ({ ...acc, [index + 1]: text }),
        {}
      )
    );
    setQuestions(exam.questions.map((q) => q.questionNumber));
    setQuestionData(
      exam.questions.reduce((acc, q) => {
        const answers = q.answers.map((a, _index) => ({
          text: a.text,
          photo: a.photo || null,
          photoPreview: a.photo || null,
          isCorrect: a.isCorrect,
          inputType: a.photo ? "photo" : "text",
        }));
        return {
          ...acc,
          [q.questionNumber]: {
            type: q.type,
            questionText: q.questionText,
            questionPhoto: q.questionPhoto || null,
            questionPhotoPreview: q.questionPhoto || null,
            questionInputType: q.questionPhoto ? "photo" : "text",
            answers,
            correctAnswerIndex:
              q.answers.findIndex((a) => a.isCorrect) + 1 || null,
            audio: q.audio || null,
            audioPreview: q.audio || null,
          },
        };
      }, {})
    );
    setFormErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    Object.keys(questionPhotoInputRefs.current).forEach((key) => {
      if (questionPhotoInputRefs.current[parseInt(key)]) {
        questionPhotoInputRefs.current[parseInt(key)]!.value = "";
      }
    });
    Object.keys(answerPhotoInputRefs.current).forEach((qKey) => {
      Object.keys(answerPhotoInputRefs.current[parseInt(qKey)]).forEach(
        (aKey) => {
          if (answerPhotoInputRefs.current[parseInt(qKey)]![parseInt(aKey)]) {
            answerPhotoInputRefs.current[parseInt(qKey)]![
              parseInt(aKey)
            ]!.value = "";
          }
        }
      );
    });
    Object.keys(audioInputRefs.current).forEach((key) => {
      if (audioInputRefs.current[parseInt(key)]) {
        audioInputRefs.current[parseInt(key)]!.value = "";
      }
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors([
          ...formErrors,
          `Photo file size exceeds 10MB limit (size: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB)`,
        ]);
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleQuestionPhotoChange = (
    questionIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors([
          ...formErrors,
          `Question ${questionIndex + 1} photo exceeds 10MB limit (size: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB)`,
        ]);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionData({
          ...questionData,
          [questionIndex]: {
            ...questionData[questionIndex],
            questionPhoto: file,
            questionPhotoPreview: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionPhotoUploadClick = (questionIndex: number) => {
    if (questionPhotoInputRefs.current[questionIndex]) {
      questionPhotoInputRefs.current[questionIndex]!.click();
    }
  };

  const removeQuestionPhoto = (questionIndex: number) => {
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        questionPhoto: null,
        questionPhotoPreview: null,
      },
    });
    if (questionPhotoInputRefs.current[questionIndex]) {
      questionPhotoInputRefs.current[questionIndex]!.value = "";
    }
  };

  const handleAnswerPhotoChange = (
    questionIndex: number,
    answerIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors([
          ...formErrors,
          `Question ${questionIndex + 1}, Answer ${
            answerIndex + 1
          } photo exceeds 10MB limit (size: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB)`,
        ]);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedAnswers = [
          ...(questionData[questionIndex]?.answers || []),
        ];
        updatedAnswers[answerIndex] = {
          ...updatedAnswers[answerIndex],
          photo: file,
          photoPreview: reader.result as string,
        };
        setQuestionData({
          ...questionData,
          [questionIndex]: {
            ...questionData[questionIndex],
            answers: updatedAnswers,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerPhotoUploadClick = (
    questionIndex: number,
    answerIndex: number
  ) => {
    if (answerPhotoInputRefs.current[questionIndex]?.[answerIndex]) {
      answerPhotoInputRefs.current[questionIndex]![answerIndex]!.click();
    }
  };

  const removeAnswerPhoto = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...(questionData[questionIndex]?.answers || [])];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      photo: null,
      photoPreview: null,
    };
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        answers: updatedAnswers,
      },
    });
    if (answerPhotoInputRefs.current[questionIndex]?.[answerIndex]) {
      answerPhotoInputRefs.current[questionIndex]![answerIndex]!.value = "";
    }
  };

  const handleAudioChange = (
    questionIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors([
          ...formErrors,
          `Audio file for question ${
            questionIndex + 1
          } exceeds 10MB limit (size: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB)`,
        ]);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionData({
          ...questionData,
          [questionIndex]: {
            ...questionData[questionIndex],
            audio: file,
            audioPreview: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUploadClick = (questionIndex: number) => {
    if (audioInputRefs.current[questionIndex]) {
      audioInputRefs.current[questionIndex]!.click();
    }
  };

  const removeAudio = (questionIndex: number) => {
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        audio: null,
        audioPreview: null,
      },
    });
    if (audioInputRefs.current[questionIndex]) {
      audioInputRefs.current[questionIndex]!.value = "";
    }
  };

  const handleGuidelineChange = (index: number, value: string): void => {
    setGuidelineTexts({
      ...guidelineTexts,
      [index]: value,
    });
  };

  const handleQuestionInputTypeChange = (
    questionIndex: number,
    inputType: "text" | "photo"
  ) => {
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        questionInputType: inputType,
        questionPhoto:
          inputType === "photo"
            ? questionData[questionIndex]?.questionPhoto
            : null,
        questionPhotoPreview:
          inputType === "photo"
            ? questionData[questionIndex]?.questionPhotoPreview
            : null,
      },
    });
  };

  const handleQuestionChange = (
    questionIndex: number,
    field: string,
    value: any
  ): void => {
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...(questionData[questionIndex] || {
          type: "reading",
          questionInputType: "text",
          questionText: "",
          answers: Array(4)
            .fill({})
            .map(() => ({
              text: "",
              isCorrect: false,
              inputType: "text",
              photo: null,
              photoPreview: null,
            })),
          correctAnswerIndex: null,
        }),
        [field]: value,
      },
    });
  };

  const handleAnswerInputTypeChange = (
    questionIndex: number,
    answerIndex: number,
    inputType: "text" | "photo"
  ) => {
    const updatedAnswers = [...(questionData[questionIndex]?.answers || [])];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      inputType,
      text: updatedAnswers[answerIndex]?.text || "",
      photo: inputType === "photo" ? updatedAnswers[answerIndex]?.photo : null,
      photoPreview:
        inputType === "photo"
          ? updatedAnswers[answerIndex]?.photoPreview
          : null,
    };
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        answers: updatedAnswers,
      },
    });
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ): void => {
    const updatedAnswers = [...(questionData[questionIndex]?.answers || [])];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      text: value,
    };
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        answers: updatedAnswers,
      },
    });
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ): void => {
    const updatedAnswers = (questionData[questionIndex]?.answers || []).map(
      (answer, idx) => ({
        ...answer,
        isCorrect: idx + 1 === answerIndex,
      })
    );
    setQuestionData({
      ...questionData,
      [questionIndex]: {
        ...questionData[questionIndex],
        answers: updatedAnswers,
        correctAnswerIndex: answerIndex,
      },
    });
  };

  const getDuration = (): string => {
    const hours = parseInt(durationHours) || 0;
    const minutes = parseInt(durationMinutes) || 0;
    const totalSeconds = hours * 3600 + minutes * 60;
    const formattedHours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const formattedMinutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const formattedSeconds = "00";
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!language.trim()) errors.push("Language is required");
    if (!topic.trim()) errors.push("Exam topic is required");
    const totalMinutes =
      (parseInt(durationHours) || 0) * 60 + (parseInt(durationMinutes) || 0);
    if (totalMinutes === 0)
      errors.push("Duration must be greater than 0 minutes");
    if (parseInt(durationHours) > 23) errors.push("Hours cannot exceed 23");
    if (parseInt(durationMinutes) > 59) errors.push("Minutes cannot exceed 59");
    if (
      readingTimeMinutes &&
      (parseInt(readingTimeMinutes) < 0 || isNaN(parseInt(readingTimeMinutes)))
    )
      errors.push("Reading section time must be a non-negative number");
    if (
      listeningTimeMinutes &&
      (parseInt(listeningTimeMinutes) < 0 ||
        isNaN(parseInt(listeningTimeMinutes)))
    )
      errors.push("Listening section time must be a non-negative number");
    if (questions.length === 0)
      errors.push("At least one question is required");

    questions.forEach((question, index) => {
      const questionInfo = questionData[question] || {
        type: "reading",
        questionInputType: "text",
        questionText: "",
        answers: Array(4)
          .fill({})
          .map(() => ({
            text: "",
            isCorrect: false,
            inputType: "text",
            photo: null,
            photoPreview: null,
          })),
        correctAnswerIndex: null,
      };
      if (
        questionInfo.type === "reading" &&
        questionInfo.questionInputType === "text" &&
        !questionInfo.questionText?.trim()
      ) {
        errors.push(
          `Question ${
            index + 1
          }: Question text is required for text-based reading questions`
        );
      }
      if (
        questionInfo.type === "reading" &&
        questionInfo.questionInputType === "photo" &&
        !questionInfo.questionPhoto
      ) {
        errors.push(
          `Question ${
            index + 1
          }: Question photo is required for photo-based reading questions`
        );
      }
      if (questionInfo.type === "listening" && !questionInfo.audio) {
        errors.push(
          `Question ${
            index + 1
          }: Audio file is required for listening questions`
        );
      }
      const answers = questionInfo.answers || [];
      if (answers.length < 4) {
        errors.push(`Question ${index + 1}: Exactly four answers are required`);
      }
      answers.forEach((answer, ansIndex) => {
        if (answer.inputType === "text" && !answer.text?.trim()) {
          errors.push(
            `Question ${index + 1}, Answer ${
              ansIndex + 1
            }: Answer text is required for text-based answers`
          );
        }
        if (
          answer.inputType === "photo" &&
          !answer.photo &&
          !answer.text?.trim()
        ) {
          errors.push(
            `Question ${index + 1}, Answer ${
              ansIndex + 1
            }: Either answer photo or text is required for photo-based answers`
          );
        }
      });
      if (!answers.some((answer) => answer.isCorrect)) {
        errors.push(
          `Question ${index + 1}: At least one answer must be marked as correct`
        );
      }
    });

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormErrors([]);
    setIsSubmitting(true);

    if (!exam || !exam.id) {
      setFormErrors(["Invalid exam ID. Please select an exam to edit."]);
      setIsSubmitting(false);
      navigate("/viewExams");
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      const formattedGuidelines = Object.values(guidelineTexts).filter(
        (text: string) => text?.trim()
      );
      const formattedQuestions = questions.map((q, index) => {
        const questionInfo = questionData[q] || {
          type: "reading",
          questionInputType: "text",
          questionText: "",
          answers: Array(4)
            .fill({})
            .map(() => ({
              text: "",
              isCorrect: false,
              inputType: "text",
              photo: null,
              photoPreview: null,
            })),
          correctAnswerIndex: null,
        };
        const answers =
          questionInfo.answers ||
          Array(4)
            .fill({})
            .map(() => ({
              text: "",
              isCorrect: false,
              inputType: "text",
              photo: null,
              photoPreview: null,
            }));
        return {
          questionNumber: index + 1,
          type: questionInfo.type || "reading",
          questionText: questionInfo.questionText || "",
          questionPhoto:
            questionInfo.questionInputType === "photo" &&
            questionInfo.questionPhoto
              ? typeof questionInfo.questionPhoto === "string"
                ? questionInfo.questionPhoto
                : "photo"
              : undefined,
          audio: questionInfo.audio
            ? typeof questionInfo.audio === "string"
              ? questionInfo.audio
              : "audio"
            : undefined,
          answers: answers.map((answer, i) => ({
            text: answer.text || "",
            photo:
              answer.inputType === "photo" && answer.photo
                ? typeof answer.photo === "string"
                  ? answer.photo
                  : "photo"
                : undefined,
            isCorrect: questionInfo.correctAnswerIndex === i + 1,
          })),
        };
      });

      const examData = {
        language,
        topic,
        duration: getDuration(),
        readingTimeMinutes,
        listeningTimeMinutes,
        description,
        guidelines: formattedGuidelines,
        questions: formattedQuestions,
        photo: typeof photo === "string" ? photo : undefined,
      };

      formData.append("examData", JSON.stringify(examData));
      if (photo instanceof File) {
        formData.append("photo", photo);
      }
      questions.forEach((q, index) => {
        const questionInfo = questionData[q];
        if (questionInfo?.audio instanceof File) {
          formData.append(`audio-${index}`, questionInfo.audio);
        }
        if (
          questionInfo?.questionInputType === "photo" &&
          questionInfo?.questionPhoto instanceof File
        ) {
          formData.append(`questionPhoto-${index}`, questionInfo.questionPhoto);
        }
        questionInfo?.answers.forEach((answer, ansIndex) => {
          if (answer.inputType === "photo" && answer.photo instanceof File) {
            formData.append(`answerPhoto-${index}-${ansIndex}`, answer.photo);
          }
        });
      });

      const response = await fetch(
        `http://localhost:5000/api/exams/${exam.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(JSON.stringify(errorData));
        } catch (parseError) {
          throw new Error(`Failed to parse response: ${text}`);
        }
      }

      await response.json();
      alert("Exam updated successfully!");
      navigate("/viewExams");
    } catch (error: unknown) {
      console.error("Error updating exam:", error);
      const errorMessages: string[] = [];
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessages.push(
            "Failed to connect to the backend. Please ensure the server is running at http://localhost:5000."
          );
        } else {
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessages.push(...errorData.errors);
            } else {
              errorMessages.push(errorData.message || "Failed to update exam");
            }
          } catch {
            errorMessages.push(error.message || "Failed to update exam");
          }
        }
      } else {
        errorMessages.push(String(error) || "An unknown error occurred");
      }
      setFormErrors(errorMessages);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (rest of the component, including JSX rendering, remains unchanged)
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-main">
        <header className="flex h-16 items-center justify-between bg-main px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#1a3a54]" />
            <div className="flex items-center gap-2">
            
              <h1 className="text-3xl font-bold text-[#1a3a54]">Edit Exam</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#1a3a54]">Username</span>
            <div className="h-10 w-10 rounded-full bg-gray-300" />
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {formErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                <h3 className="font-semibold">Errors:</h3>
                <ul className="list-disc pl-5">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="w-96 max-w-full">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full border-[#4894c4] rounded-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                    <SelectItem value="korean">Korean</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label htmlFor="exam-topic" className="font-medium">
                  Exam Topic:
                </label>
                <Input
                  id="exam-topic"
                  className="rounded-full"
                  value={topic}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTopic(e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                <label className="font-medium pt-2">Duration:</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="duration-hours"
                      className="block text-sm font-medium mb-1"
                    >
                      Hours
                    </label>
                    <Input
                      id="duration-hours"
                      type="number"
                      min="0"
                      max="23"
                      className="rounded-full"
                      value={durationHours}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDurationHours(e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="duration-minutes"
                      className="block text-sm font-medium mb-1"
                    >
                      Minutes
                    </label>
                    <Input
                      id="duration-minutes"
                      type="number"
                      min="0"
                      max="59"
                      className="rounded-full"
                      value={durationMinutes}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDurationMinutes(e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                <label className="font-medium pt-2">Section Times:</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="reading-time"
                      className="block text-sm font-medium mb-1"
                    >
                      Reading (Minutes)
                    </label>
                    <Input
                      id="reading-time"
                      type="number"
                      min="0"
                      max="120"
                      className="rounded-full"
                      value={readingTimeMinutes}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setReadingTimeMinutes(e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="listening-time"
                      className="block text-sm font-medium mb-1"
                    >
                      Listening (Minutes)
                    </label>
                    <Input
                      id="listening-time"
                      type="number"
                      min="0"
                      max="120"
                      className="rounded-full"
                      value={listeningTimeMinutes}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setListeningTimeMinutes(e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                <label htmlFor="photo" className="font-medium pt-2">
                  Add photo:
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Exam preview"
                        className="h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={handleUploadClick}
                      className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4894c4]"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG or GIF (max 10MB)
                      </p>
                    </div>
                  )}
                  <Button
                    type="button"
                    onClick={handleUploadClick}
                    className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-full"
                  >
                    {photoPreview ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                <label htmlFor="description" className="font-medium">
                  Description:
                </label>
                <Input
                  id="description"
                  className="rounded-full"
                  value={description}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              {guidelines.map((guideline, index) => (
                <div key={guideline} className="space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor={`guideline-${guideline}`}
                      className="font-medium"
                    >
                      Guideline {index + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeGuideline(guideline)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <Textarea
                    id={`guideline-${guideline}`}
                    className="min-h-24 rounded-lg"
                    value={guidelineTexts[guideline] || ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleGuidelineChange(guideline, e.target.value)
                    }
                  />
                </div>
              ))}

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={addGuideline}
                  className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guideline
                </Button>
                {questions.length === 0 && (
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                )}
              </div>

              {questions.map((question, index) => (
                <div
                  key={question}
                  className="border border-[#4894c4] rounded-lg p-6 space-y-6 relative"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">
                      Question {String(index + 1).padStart(2, "0")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <Select
                        value={questionData[question]?.type || "reading"}
                        onValueChange={(value) => {
                          const newQuestionData = {
                            ...questionData[question],
                            type: value,
                            questionInputType:
                              value === "listening"
                                ? "photo"
                                : questionData[question]?.questionInputType ||
                                  "text",
                            answers: (
                              questionData[question]?.answers ||
                              Array(4)
                                .fill({})
                                .map(() => ({
                                  text: "",
                                  isCorrect: false,
                                  inputType: "text",
                                  photo: null,
                                  photoPreview: null,
                                }))
                            ).map((answer: Answer) => ({
                              ...answer,
                              inputType:
                                value === "listening"
                                  ? answer.inputType
                                  : answer.inputType,
                            })),
                          };
                          setQuestionData({
                            ...questionData,
                            [question]: newQuestionData,
                          });
                        }}
                      >
                        <SelectTrigger className="w-32 border-[#4894c4] rounded-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {questionData[question]?.type === "reading" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          Question Input Type:
                        </span>
                        <Select
                          value={
                            questionData[question]?.questionInputType || "text"
                          }
                          onValueChange={(value: "text" | "photo") =>
                            handleQuestionInputTypeChange(question, value)
                          }
                        >
                          <SelectTrigger className="w-32 border-[#4894c4] rounded-full">
                            <SelectValue placeholder="Select input type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {questionData[question]?.questionInputType === "text" ? (
                        <Textarea
                          className="min-h-24 rounded-lg"
                          placeholder="Enter your question here"
                          value={questionData[question]?.questionText || ""}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            handleQuestionChange(
                              question,
                              "questionText",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <div className="space-y-4">
                          <input
                            type="file"
                            ref={(el) => {
                              if (el)
                                questionPhotoInputRefs.current[question] = el;
                            }}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleQuestionPhotoChange(question, e)
                            }
                          />
                          {questionData[question]?.questionPhotoPreview ? (
                            <div className="relative">
                              <img
                                src={
                                  questionData[question].questionPhotoPreview
                                }
                                alt="Question preview"
                                className="h-48 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeQuestionPhoto(question)}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                handleQuestionPhotoUploadClick(question)
                              }
                              className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4894c4]"
                            >
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Click to upload an image
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                JPG, PNG or GIF (max 10MB)
                              </p>
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() =>
                              handleQuestionPhotoUploadClick(question)
                            }
                            className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-full"
                          >
                            {questionData[question]?.questionPhotoPreview
                              ? "Change Image"
                              : "Upload Image"}
                          </Button>
                          <Textarea
                            className="min-h-24 rounded-lg"
                            placeholder="Optional: Add question text"
                            value={questionData[question]?.questionText || ""}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              handleQuestionChange(
                                question,
                                "questionText",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-medium">
                          Question Input Type:
                        </label>
                        <Select
                          value={
                            questionData[question]?.questionInputType || "text"
                          }
                          onValueChange={(value: "text" | "photo") =>
                            handleQuestionInputTypeChange(question, value)
                          }
                        >
                          <SelectTrigger className="w-32 border-[#4894c4] rounded-full">
                            <SelectValue placeholder="Select input type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {questionData[question]?.questionInputType === "text" ? (
                        <div className="space-y-2">
                          <label className="font-medium">Question Text:</label>
                          <Textarea
                            className="min-h-24 rounded-lg"
                            placeholder="Optional: Enter the listening question here (e.g., What does the speaker say about the weather?)"
                            value={questionData[question]?.questionText || ""}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              handleQuestionChange(
                                question,
                                "questionText",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <input
                            type="file"
                            ref={(el) => {
                              if (el)
                                questionPhotoInputRefs.current[question] = el;
                            }}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleQuestionPhotoChange(question, e)
                            }
                          />
                          {questionData[question]?.questionPhotoPreview ? (
                            <div className="relative">
                              <img
                                src={
                                  questionData[question].questionPhotoPreview
                                }
                                alt="Question preview"
                                className="h-48 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeQuestionPhoto(question)}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                handleQuestionPhotoUploadClick(question)
                              }
                              className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4894c4]"
                            >
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Click to upload an image
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                JPG, PNG or GIF (max 10MB)
                              </p>
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() =>
                              handleQuestionPhotoUploadClick(question)
                            }
                            className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-full"
                          >
                            {questionData[question]?.questionPhotoPreview
                              ? "Change Image"
                              : "Upload Image"}
                          </Button>
                          <Textarea
                            className="min-h-24 rounded-lg"
                            placeholder="Optional: Add question text"
                            value={questionData[question]?.questionText || ""}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              handleQuestionChange(
                                question,
                                "questionText",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="font-medium">Add Audio:</label>
                        <input
                          type="file"
                          ref={(el) => {
                            if (el) audioInputRefs.current[question] = el;
                          }}
                          className="hidden"
                          accept="audio/*"
                          onChange={(e) => handleAudioChange(question, e)}
                        />
                        {questionData[question]?.audioPreview ? (
                          <div className="relative">
                            <audio
                              src={questionData[question].audioPreview}
                              controls
                              className="w-full"
                            />
                            <button
                              type="button"
                              onClick={() => removeAudio(question)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleAudioUploadClick(question)}
                            className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4894c4]"
                          >
                            <Upload className="h-6 w-6 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Click to upload an audio file
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              MP3, WAV (max 10MB)
                            </p>
                          </div>
                        )}
                        <Button
                          type="button"
                          onClick={() => handleAudioUploadClick(question)}
                          className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-full"
                        >
                          {questionData[question]?.audioPreview
                            ? "Change Audio"
                            : "Upload Audio"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-medium">Answers:</h4>
                    {[1, 2, 3, 4].map((answer, ansIndex) => (
                      <div key={answer} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6">{answer}.</span>
                          <Select
                            value={
                              questionData[question]?.answers[ansIndex]
                                ?.inputType || "text"
                            }
                            onValueChange={(value: "text" | "photo") =>
                              handleAnswerInputTypeChange(
                                question,
                                ansIndex,
                                value
                              )
                            }
                          >
                            <SelectTrigger className="w-32 border-[#4894c4] rounded-full">
                              <SelectValue placeholder="Select input type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#4894c4] rounded-lg shadow-lg">
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="photo">Photo</SelectItem>
                            </SelectContent>
                          </Select>
                          <Checkbox
                            id={`correct-${question}-${answer}`}
                            checked={
                              questionData[question]?.correctAnswerIndex ===
                              answer
                            }
                            onCheckedChange={() =>
                              handleCorrectAnswerChange(question, answer)
                            }
                            className="h-5 w-5 border-[#4894c4] data-[state=checked]:bg-[#4894c4]"
                          />
                        </div>
                        {questionData[question]?.answers[ansIndex]
                          ?.inputType === "text" ? (
                          <Input
                            className="w-260 flex-1 rounded-full ml-8"
                            value={
                              questionData[question]?.answers?.[ansIndex]
                                ?.text || ""
                            }
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleAnswerChange(
                                question,
                                ansIndex,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <div className="space-y-4 ml-8">
                            <input
                              type="file"
                              ref={(el) => {
                                if (!answerPhotoInputRefs.current[question]) {
                                  answerPhotoInputRefs.current[question] = {};
                                }
                                if (el)
                                  answerPhotoInputRefs.current[question]![
                                    ansIndex
                                  ] = el;
                              }}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) =>
                                handleAnswerPhotoChange(question, ansIndex, e)
                              }
                            />
                            {questionData[question]?.answers[ansIndex]
                              ?.photoPreview ? (
                              <div className="relative">
                                <img
                                  src={
                                    questionData[question].answers[ansIndex]
                                      .photoPreview
                                  }
                                  alt={`Answer ${ansIndex + 1} preview`}
                                  className="h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAnswerPhoto(question, ansIndex)
                                  }
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handleAnswerPhotoUploadClick(
                                    question,
                                    ansIndex
                                  )
                                }
                                className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4894c4]"
                              >
                                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  Click to upload an image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  JPG, PNG or GIF (max 10MB)
                                </p>
                              </div>
                            )}
                            <Button
                              type="button"
                              onClick={() =>
                                handleAnswerPhotoUploadClick(question, ansIndex)
                              }
                              className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-full"
                            >
                              {questionData[question]?.answers[ansIndex]
                                ?.photoPreview
                                ? "Change Image"
                                : "Upload Image"}
                            </Button>
                            <Input
                              className="w-260 flex-1 rounded-full"
                              placeholder="Optional: Add answer text"
                              value={
                                questionData[question]?.answers?.[ansIndex]
                                  ?.text || ""
                              }
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleAnswerChange(
                                  question,
                                  ansIndex,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {questions.length > 0 && (
                <div className="flex mt-6">
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="bg-[#4894c4] hover:bg-[#3a7da9] text-white rounded-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 rounded-md"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1c3c5d] hover:bg-[#16324d] text-white px-8 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
