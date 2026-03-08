"use client";

import { useBuilderStore } from "@/features/builder/stores/builder.store";

export function InspectorPanel() {
  const widgets = useBuilderStore((state) => state.widgets);
  const selectedWidgetId = useBuilderStore((state) => state.selectedWidgetId);
  const isDirty = useBuilderStore((state) => state.isDirty);

  const selectedWidget = widgets.find(
    (widget) => widget.id === selectedWidgetId,
  );

  return (
    <aside className="h-full bg-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">รายละเอียดวิดเจ็ต</h2>
        <p className="mt-1 text-sm text-neutral-500">
          ตรวจสอบสถานะและรายละเอียดของวิดเจ็ตที่เลือก
        </p>
      </div>

      <div className="mb-4 rounded-2xl border bg-neutral-50 p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          สถานะการบันทึก
        </p>
        <p className="mt-2 text-sm font-medium">
          {isDirty ? "มีการเปลี่ยนแปลงที่ยังไม่บันทึก" : "ไม่มีการเปลี่ยนแปลง"}
        </p>
      </div>

      {!selectedWidget ? (
        <div className="rounded-2xl border border-dashed bg-neutral-50 p-6">
          <p className="text-sm text-neutral-600">
            เลือกวิดเจ็ตที่ต้องการดูรายละเอียด
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              ประเภทวิดเจ็ต
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedWidget.widgetType}
            </p>
          </div>

          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              ชื่อหัวข้อ
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedWidget.title || "-"}
            </p>
          </div>

          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              ลำดับ
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedWidget.orderIndex}
            </p>
          </div>

          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              สถานะการแสดงผล
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedWidget.isCollapsed ? "ยุบ" : "ขยาย"}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
