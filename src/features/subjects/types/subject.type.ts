export type Subject = {
  id: string;
  ownerId: string;
  subjectGroup: string;
  subjectName: string;
  subjectCode: string;
  gradeLevel: string;
  semester: string;
  academicYear: string;
  schoolName: string;
  teacherName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type LearningUnit = {
  id: string;
  subjectId: string;
  unitNo: number;
  unitTitle: string;
  description: string;
  totalHours: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubjectRequest = {
  subjectGroup: string;
  subjectName: string;
  subjectCode: string;
  gradeLevel: string;
  semester: string;
  academicYear: string;
  schoolName: string;
  teacherName: string;
};

export type CreateLearningUnitRequest = {
  unitNo: number;
  unitTitle: string;
  description: string;
  totalHours: number;
  orderIndex: number;
};