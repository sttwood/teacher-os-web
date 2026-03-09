"use client";

import { WidgetLibrary } from "@/features/builder/components/WidgetLibrary";
import { BuilderCanvas } from "@/features/builder/components/BuilderCanvas";
import { InspectorPanel } from "@/features/builder/components/InspectorPanel";
import { useBuilderStore } from "@/features/builder/stores/builder.store";
import { builderApi } from "../api/builder.api";
import { useState } from "react";
import { builderExportApi } from "@/features/builder/api/builder-export.api";
import { downloadBlobFile } from "@/features/builder/utils/download-file";
import { ApiError } from "@/lib/api/client";

export function BuilderLayout() {
  const planId = useBuilderStore((state) => state.planId);
  const planMeta = useBuilderStore((state) => state.planMeta);
  const widgets = useBuilderStore((state) => state.widgets);
  const isDirty = useBuilderStore((state) => state.isDirty);
  const saveStatus = useBuilderStore((state) => state.saveStatus);
  const lastSavedAt = useBuilderStore((state) => state.lastSavedAt);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);
  const setLastSavedAt = useBuilderStore((state) => state.setLastSavedAt);
  const markDirty = useBuilderStore((state) => state.markDirty);

  const [isExportingDOCX, setIsExportingDOCX] = useState(false);
  const [exportError, setExportError] = useState("");

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

  const handleExportDOCX = async () => {
    if (!planId) return;

    try {
      setIsExportingDOCX(true);
      setExportError("");

      const blob = await builderExportApi.exportDOCX(planId);
      downloadBlobFile(blob, `lesson-plan-${planId}.docx`);
    } catch (error) {
      const apiError = error as ApiError;
      setExportError(apiError.message);
    } finally {
      setIsExportingDOCX(false);
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
              {planMeta?.title || "ยังไม่มีชื่อแผน"}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                รายวิชา: {planMeta?.subjectGroup || "-"}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                ชั้น: {planMeta?.gradeLevel || "-"}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                แผนที่: {planMeta?.lessonNo || "-"}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                ชื่อคาบ: {planMeta?.lessonTitle || "-"}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                ชั่วโมง: {planMeta?.lessonHours || "-"}
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1">
                ภาคเรียน: {planMeta?.semester || "-"} / ปี{" "}
                {planMeta?.academicYear || "-"}
              </span>
            </div>

            <p className="mt-2 text-xs text-neutral-400">
              โรงเรียน: {planMeta?.schoolName || "-"} • ครูผู้สอน:{" "}
              {planMeta?.teacherName || "-"}
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

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => void handleExportDOCX()}
                disabled={!planId || isExportingDOCX}
                className="rounded-xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
              >
                {isExportingDOCX ? "กำลังส่งออก DOCX..." : "ส่งออก DOCX"}
              </button>
              {exportError && (
                <p className="mt-2 text-sm text-red-600">{exportError}</p>
              )}
            </div>
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
