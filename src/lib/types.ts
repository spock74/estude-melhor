export type Subject = {
  name: string;
  id: string;
};

export type Curriculum = {
  [year: string]: Subject[];
};

export type StudySession = {
  id: string;
  subjectId: string;
  subjectName: string;
  startTime: number;
  endTime: number;
  duration: number; // in minutes
};

export type SelfAssessment = {
  id: string;
  date: number;
  schoolYear: string;
  subjectId: string;
  subjectName: string;
  rating: number; // 1-5
  notes?: string;
};

export type ParentalAssessment = {
  id: string;
  date: number;
  adherenceRating: number; // 1-5
  notes?: string;
};
