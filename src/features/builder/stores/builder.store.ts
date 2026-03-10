"use client";

import { create } from "zustand";
import type {
  BuilderWidget,
  BuilderWidgetType,
} from "@/features/builder/types/builder.type";
import type { Plan } from "@/features/plans/types/plan.type";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function createDefaultContent(widgetType: BuilderWidgetType): Record<string, unknown> {
  switch (widgetType) {
    case "basicInfo":
      return {
        ชื่อแผนการจัดการเรียนรู้: "",
        รายวิชา: "",
        รหัสวิชา: "",
        ระดับชั้น: "",
        ภาคเรียน: "",
        ปีการศึกษา: "",
        หน่วยการเรียนรู้: "",
        เรื่อง: "",
        เวลาเรียน: "1 ชั่วโมง",
      };
    case "objective":
      return {
        สาระสำคัญ: "",
        จุดประสงค์การเรียนรู้: [],
      };
    case "standardIndicator":
      return {
        มาตรฐานการเรียนรู้: [],
        ตัวชี้วัด: [],
        สมรรถนะสำคัญของผู้เรียน: [],
        คุณลักษณะอันพึงประสงค์: [],
      };
    case "activity":
      return {
        ขั้นนำเข้าสู่บทเรียน: "",
        ขั้นจัดกิจกรรมการเรียนรู้: "",
        ขั้นสรุป: "",
        กิจกรรมย่อย: [],
      };
    case "mediaMaterial":
      return {
        สื่อการเรียนรู้: [],
        อุปกรณ์: [],
        แหล่งการเรียนรู้: [],
      };
    case "assessment":
      return {
        วิธีการวัดและประเมินผล: [],
        เครื่องมือ: [],
        เกณฑ์การประเมิน: [],
      };
    case "homework":
      return {
        ชิ้นงานหรือภาระงาน: "",
        งานที่มอบหมาย: "",
        บันทึกหลังสอน: "",
        หมายเหตุ: "",
      };
    default:
      return {};
  }
}

function createDefaultTitle(widgetType: BuilderWidgetType): string {
  switch (widgetType) {
    case "basicInfo":
      return "ข้อมูลทั่วไป";
    case "objective":
      return "จุดประสงค์การเรียนรู้";
    case "standardIndicator":
      return "มาตรฐาน / ตัวชี้วัด";
    case "activity":
      return "กิจกรรมการเรียนรู้";
    case "mediaMaterial":
      return "สื่อ / แหล่งการเรียนรู้";
    case "assessment":
      return "การวัดและประเมินผล";
    case "homework":
      return "ชิ้นงาน / ภาระงาน / บันทึกหลังสอน";
    default:
      return "วิดเจ็ต";
  }
}

function reindexWidgets(widgets: BuilderWidget[]): BuilderWidget[] {
  return widgets.map((widget, index) => ({
    ...widget,
    orderIndex: index + 1,
  }));
}

type BuilderState = {
  planId: string | null;
  planMeta: Plan | null;
  widgets: BuilderWidget[];
  selectedWidgetId: string | null;
  isDirty: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;

  setPlanId: (planId: string) => void;
  setPlanMeta: (plan: Plan | null) => void;
  setWidgets: (widgets: BuilderWidget[]) => void;
  selectWidget: (widgetId: string | null) => void;
  markDirty: (value: boolean) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setLastSavedAt: (value: string | null) => void;

  addWidget: (widgetType: BuilderWidgetType) => void;
  duplicateWidget: (widgetId: string) => void;
  deleteWidget: (widgetId: string) => void;
  toggleCollapseWidget: (widgetId: string) => void;
  moveWidgetUp: (widgetId: string) => void;
  moveWidgetDown: (widgetId: string) => void;
  updateWidgetTitle: (widgetId: string, title: string) => void;
  updateWidgetContent: (
    widgetId: string, 
    contentJSON: Record<string, unknown>
  ) => void;
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  planId: null,
  planMeta: null,
  widgets: [],
  selectedWidgetId: null,
  isDirty: false,
  saveStatus: "idle",
  lastSavedAt: null,

  setPlanId: (planId) => set({ planId }),
  setPlanMeta: (planMeta) => set({ planMeta }),

  setWidgets: (widgets) =>
    set({
      widgets: reindexWidgets(widgets),
      isDirty: false,
      saveStatus: "idle",
    }),

  selectWidget: (selectedWidgetId) => set({ selectedWidgetId }),

  markDirty: (isDirty) => set({ isDirty }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),

  addWidget: (widgetType) => {
    const { widgets } = get();

    const newWidget: BuilderWidget = {
      id: crypto.randomUUID(),
      widgetType,
      orderIndex: widgets.length + 1,
      title: createDefaultTitle(widgetType),
      contentJSON: createDefaultContent(widgetType),
      isCollapsed: false,
    };

    set({
      widgets: reindexWidgets([...widgets, newWidget]),
      selectedWidgetId: newWidget.id,
      isDirty: true,
      saveStatus: "idle",
    });
  },

  duplicateWidget: (widgetId) => {
    const { widgets } = get();
    const target = widgets.find((widget) => widget.id === widgetId);
    if (!target) return;

    const duplicated: BuilderWidget = {
      ...target,
      id: crypto.randomUUID(),
      title: `${target.title} Copy`,
    };

    const targetIndex = widgets.findIndex((widget) => widget.id === widgetId);
    const nextWidgets = [...widgets];
    nextWidgets.splice(targetIndex + 1, 0, duplicated);

    set({
      widgets: reindexWidgets(nextWidgets),
      selectedWidgetId: duplicated.id,
      isDirty: true,
      saveStatus: "idle",
    });
  },

  deleteWidget: (widgetId) => {
    const { widgets, selectedWidgetId } = get();
    const nextWidgets = widgets.filter((widget) => widget.id !== widgetId);

    set({
      widgets: reindexWidgets(nextWidgets),
      selectedWidgetId: selectedWidgetId === widgetId ? null : selectedWidgetId,
      isDirty: true,
      saveStatus: "idle",
    });
  },

  toggleCollapseWidget: (widgetId) => {
    const { widgets } = get();

    set({
      widgets: widgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, isCollapsed: !widget.isCollapsed }
          : widget
      ),
      isDirty: true,
      saveStatus: "idle",
    });
  },

  moveWidgetUp: (widgetId) => {
    const { widgets } = get();
    const index = widgets.findIndex((widget) => widget.id === widgetId);
    if (index <= 0) return;

    const nextWidgets = [...widgets];
    [nextWidgets[index - 1], nextWidgets[index]] = [
      nextWidgets[index],
      nextWidgets[index - 1],
    ];

    set({
      widgets: reindexWidgets(nextWidgets),
      selectedWidgetId: widgetId,
      isDirty: true,
      saveStatus: "idle",
    });
  },

  moveWidgetDown: (widgetId) => {
    const { widgets } = get();
    const index = widgets.findIndex((widget) => widget.id === widgetId);
    if (index === -1 || index >= widgets.length - 1) return;

    const nextWidgets = [...widgets];
    [nextWidgets[index], nextWidgets[index + 1]] = [
      nextWidgets[index + 1],
      nextWidgets[index],
    ];

    set({
      widgets: reindexWidgets(nextWidgets),
      selectedWidgetId: widgetId,
      isDirty: true,
      saveStatus: "idle",
    });
  },

  updateWidgetTitle: (widgetId, title) => {
    const { widgets } = get();

    set({
      widgets: widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, title } : widget
      ),
      isDirty: true,
      saveStatus: "idle",
    });
  },

  updateWidgetContent: (widgetId, contentJSON) => {
    const { widgets } = get();

    set({
      widgets: widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, contentJSON } : widget
      ),
      isDirty: true,
      saveStatus: "idle",
    });
  },
}));