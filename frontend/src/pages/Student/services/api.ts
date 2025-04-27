
import { Exam } from '../types/exam';

// Fetch a single exam by ID
export const fetchExamById = async (id: string): Promise<Exam> => {
  const response = await fetch(`http://localhost:5000/api/exams/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exam: ${errorText}`);
  }
  const data = await response.json();
  console.log('API response for fetchExamById:', data);
  return data;
};

// Fetch all exams
export const fetchExams = async (): Promise<Exam[]> => {
  const response = await fetch('http://localhost:5000/api/exams');
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exams: ${errorText}`);
  }
  const data = await response.json();
  console.log('API response for fetchExams:', data);
  return data;
};

// Fetch exam photo by exam ID
export const fetchExamPhoto = async (id: string): Promise<string> => {
  const response = await fetch(`http://localhost:5000/api/exams/${id}/photo`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exam photo: ${errorText}`);
  }
  // Since the backend sends the file directly, we return the URL for the <img> src
  console.log('API response for fetchExamPhoto: Success for exam ID', id);
  return `http://localhost:5000/api/exams/${id}/photo`;
};