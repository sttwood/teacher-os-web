import { apiClient, toApiError, type ApiSuccessResponse } from "@/lib/api/client";
import type {
  CreatePlanRequest,
  CreatePlanResult,
  ListPlansParams,
  ListPlansResult,
  Plan,
} from "@/features/plans/types/plan.type";

export const plansApi = {
  async list(params?: ListPlansParams): Promise<ListPlansResult> {
    try {
      const { data } = await apiClient.get<ApiSuccessResponse<Plan[]>>("/plans", {
        params,
      });

      return {
        items: data.data,
        meta: data.meta,
      };
    } catch (error) {
      throw toApiError(error);
    }
  },

  async create(payload: CreatePlanRequest): Promise<CreatePlanResult> {
    try {
      const { data } = await apiClient.post<ApiSuccessResponse<Plan>>(
        "/plans",
        payload
      );

      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },
};