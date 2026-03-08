export type Plan = {
  id: string;
  ownerId: string;
  subjectId?: string;
  learningUnitId?: string;
  lessonNo: number;
  lessonTitle: string;
  lessonHours: number;
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
  subjectId: string;
  learningUnitId: string;
  lessonNo: number;
  lessonTitle: string;
  lessonHours: number;
  title: string;
};

export type CreatePlanResult = Plan;