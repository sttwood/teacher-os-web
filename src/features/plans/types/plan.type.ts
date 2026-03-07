export type Plan = {
  id: string;
  ownerId: string;
  title: string;
  subjectGroup: string;
  gradeLevel: string;
  semester: string;
  academicYear: string;
  schoolName: string;
  teacherName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ListPlansParams = {
  status?: string;
  subjectGroup?: string;
  gradeLevel?: string;
};

export type ListPlansResult = {
  items: Plan[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

export type CreatePlanRequest = {
  title: string;
  subjectGroup: string;
  gradeLevel: string;
  semester: string;
  academicYear: string;
  schoolName: string;
  teacherName: string;
};

export type CreatePlanResult = Plan;