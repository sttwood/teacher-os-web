"use client";

import { WidgetLibrary } from "@/features/builder/components/WidgetLibrary";
import { BuilderCanvas } from "@/features/builder/components/BuilderCanvas";
import { InspectorPanel } from "@/features/builder/components/InspectorPanel";
import { useBuilderStore } from "@/features/builder/stores/builder.store";
import { builderApi } from "../api/builder.api";

export function BuilderLayout() {
  const planId = useBuilderStore((state) => state.planId);
  const widgets = useBuilderStore((state) => state.widgets);
  const isDirty = useBuilderStore((state) => state.isDirty);
  const saveStatus = useBuilderStore((state) => state.saveStatus);
  const lastSavedAt = useBuilderStore((state) => state.lastSavedAt);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);
  const setLastSavedAt = useBuilderStore((state) => state.setLastSavedAt);
  const markDirty = useBuilderStore((state) => state.markDirty);

  const handleManualSave = async () => {
    try {
      setSaveStatus("saving");
      await builderApi.saveWidgets(planId!, widgets);
      markDirty(false);
      setSaveStatus("saved");
      setLastSavedAt(new Date().toISOString());
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              ตัวสร้างแผนการจัดการเรียนรู้
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              รหัสแผน: {planId ?? "-"} • จำนวนวิดเจ็ต: {widgets.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
              {saveStatus === "saving" && "กำลังบันทึก..."}
              {saveStatus === "saved" &&
                `บันทึกแล้ว${lastSavedAt ? ` เวลา ${new Date(lastSavedAt).toLocaleTimeString("th-TH")}` : ""}`}
              {saveStatus === "error" && "บันทึกไม่สำเร็จ"}
              {saveStatus === "idle" &&
                (isDirty ? "มีการเปลี่ยนแปลงที่ยังไม่บันทึก" : "พร้อมใช้งาน")}
            </div>

            <button
              type="button"
              onClick={() => void handleManualSave()}
              className="rounded-xl border bg-white px-4 py-2 text-sm"
            >
              บันทึก
            </button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-73px)] grid-cols-12">
        <div className="col-span-3">
          <WidgetLibrary />
        </div>

        <div className="col-span-6 border-x bg-white">
          <BuilderCanvas />
        </div>

        <div className="col-span-3">
          <InspectorPanel />
        </div>
      </div>
    </main>
  );
}
