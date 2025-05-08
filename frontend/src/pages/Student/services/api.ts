
import { Exam } from "../types/exam";

interface UserPlanPurchase {
  _id: string;
  userId: string;
  pricePlanId: {
    _id: string;
    name: string;
    exams: Exam[];
  };
  purchaseDate: string;
  expiryDate?: string;
  isActive: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL

// Fetch a single exam by ID
export const fetchExamById = async (id: string): Promise<Exam> => {
  const response = await fetch(`${apiUrl}/api/exams/${id}`, {
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exam: ${errorText}`);
  }
  const data = await response.json();
  console.log("API response for fetchExamById:", data);
  return data;
};

// Fetch all exams (filtered by user plans)
export const fetchExams = async (): Promise<Exam[]> => {
  const response = await fetch(`${apiUrl}/api/exams`, {
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exams: ${errorText}`);
  }
  const data = await response.json();
  console.log("API response for fetchExams:", data);
  return data;
};

// Fetch exam photo by exam ID
export const fetchExamPhoto = async (id: string): Promise<string> => {
  const response = await fetch(`${apiUrl}/api/exams/${id}/photo`, {
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch exam photo: ${errorText}`);
  }
  console.log("API response for fetchExamPhoto: Success for exam ID", id);
  return `${apiUrl}/api/exams/${id}/photo`;
};

// Purchase a price plan
export const purchasePlan = async (pricePlanId: string): Promise<void> => {
  const response = await fetch(
    `${apiUrl}/api/user-plan-purchases`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pricePlanId }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to purchase plan: ${errorText}`);
  }
};

// Fetch active user plan purchases
export const fetchActiveUserPlans = async (): Promise<UserPlanPurchase[]> => {
  const response = await fetch(
    `${apiUrl}/api/user-plan-purchases/active`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch active plans: ${errorText}`);
  }
  const data = await response.json();
  console.log("API response for fetchActiveUserPlans:", data);
  return data;
};
