import { apiClient, toApiError } from "@/lib/api/client";

export const builderExportApi = {
  async exportDOCX(planId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/plans/${planId}/export/docx`, {
        responseType: "blob",
      });

      return response.data as Blob;
    } catch (error) {
      throw toApiError(error);
    }
  },
};