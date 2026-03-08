import { apiClient, toApiError, type ApiSuccessResponse } from "@/lib/api/client";
import type {
  CreateLearningUnitRequest,
  CreateSubjectRequest,
  LearningUnit,
  Subject,
} from "@/features/subjects/types/subject.type";

export const subjectsApi = {
  async listSubjects(): Promise<Subject[]> {
    try {
      const { data } = await apiClient.get<ApiSuccessResponse<Subject[]>>("/subjects");
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async createSubject(payload: CreateSubjectRequest): Promise<Subject> {
    try {
      const { data } = await apiClient.post<ApiSuccessResponse<Subject>>(
        "/subjects",
        payload
      );
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async listUnits(subjectId: string): Promise<LearningUnit[]> {
    try {
      const { data } = await apiClient.get<ApiSuccessResponse<LearningUnit[]>>(
        `/subjects/${subjectId}/units`
      );
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async createUnit(
    subjectId: string,
    payload: CreateLearningUnitRequest
  ): Promise<LearningUnit> {
    try {
      const { data } = await apiClient.post<ApiSuccessResponse<LearningUnit>>(
        `/subjects/${subjectId}/units`,
        payload
      );
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },
};