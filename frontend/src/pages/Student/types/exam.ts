
export interface Answer {
  _id?: string;
  text?: string;
  photo?: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  questionNumber: number;
  type: 'reading' | 'listening';
  questionText?: string;
  questionPhoto?: string;
  answers: Answer[];
  audio?: string;
}

export interface Exam {
  _id: string;
  language: string;
  topic: string;
  duration: string;
  readingTimeMinutes: string;
  listeningTimeMinutes: string;
  photo?: string;
  photoFileName?: string;
  description?: string;
  guidelines: string[];
  questions: Question[];
  createdAt: string;
}