import { apiClient, toApiError, type ApiSuccessResponse } from "@/lib/api/client";
import type { BuilderWidget } from "@/features/builder/types/builder.type";

export const builderApi = {
  async getWidgets(planId: string): Promise<BuilderWidget[]> {
    try {
      const { data } = await apiClient.get<ApiSuccessResponse<BuilderWidget[]>>(
        `/plans/${planId}/widgets`
      );
      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async saveWidgets(planId: string, widgets: BuilderWidget[]): Promise<BuilderWidget[]> {
    try {
      const payload = {
        widgets: widgets.map((widget) => ({
          id: widget.id,
          widgetType: widget.widgetType,
          orderIndex: widget.orderIndex,
          title: widget.title,
          contentJSON: widget.contentJSON,
          isCollapsed: widget.isCollapsed,
        })),
      };

      const { data } = await apiClient.put<ApiSuccessResponse<BuilderWidget[]>>(
        `/plans/${planId}/widgets`,
        payload
      );

      return data.data;
    } catch (error) {
      throw toApiError(error);
    }
  }
};