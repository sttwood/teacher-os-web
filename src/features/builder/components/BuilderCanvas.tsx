"use client";

import { useBuilderStore } from "@/features/builder/stores/builder.store";

export function BuilderCanvas() {
  const widgets = useBuilderStore((state) => state.widgets);
  const selectedWidgetId = useBuilderStore((state) => state.selectedWidgetId);
  const selectWidget = useBuilderStore((state) => state.selectWidget);
  const duplicateWidget = useBuilderStore((state) => state.duplicateWidget);
  const deleteWidget = useBuilderStore((state) => state.deleteWidget);
  const toggleCollapseWidget = useBuilderStore(
    (state) => state.toggleCollapseWidget,
  );
  const moveWidgetUp = useBuilderStore((state) => state.moveWidgetUp);
  const moveWidgetDown = useBuilderStore((state) => state.moveWidgetDown);

  return (
    <section className="h-full p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">พื้นที่จัดแผน</h2>
        <p className="mt-1 text-sm text-neutral-500">
          เพิ่ม เรียงลำดับ คัดลอก ยุบ หรือ ลบวิดเจ็ตของแผนการสอน
        </p>
      </div>

      {widgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-neutral-50 p-12 text-center">
          <p className="text-sm font-medium">ยังไม่มีหัวข้อในแผน</p>
          <p className="mt-2 text-sm text-neutral-500">
            เริ่มต้นโดยเพิ่มวิดเจ็ตจากคลังทางด้านซ้าย
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {widgets.map((widget, index) => {
            const isSelected = widget.id === selectedWidgetId;

            return (
              <div
                key={widget.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                  isSelected
                    ? "border-black ring-2 ring-black/10"
                    : "hover:border-neutral-300 hover:shadow"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => selectWidget(widget.id)}
                    className="flex-1 text-left"
                  >
                    <h3 className="text-base font-semibold">
                      {widget.title || widget.widgetType}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
                      {widget.widgetType}
                    </p>
                  </button>

                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600">
                    ลำดับ {widget.orderIndex}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveWidgetUp(widget.id)}
                    disabled={index === 0}
                    className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    เลื่อนขึ้น
                  </button>

                  <button
                    type="button"
                    onClick={() => moveWidgetDown(widget.id)}
                    disabled={index === widgets.length - 1}
                    className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    เลื่อนลง
                  </button>

                  <button
                    type="button"
                    onClick={() => duplicateWidget(widget.id)}
                    className="rounded-xl border px-3 py-1.5 text-sm"
                  >
                    คัดลอก
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCollapseWidget(widget.id)}
                    className="rounded-xl border px-3 py-1.5 text-sm"
                  >
                    {widget.isCollapsed ? "ขยาย" : "ยุบ"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteWidget(widget.id)}
                    className="rounded-xl border px-3 py-1.5 text-sm text-red-600"
                  >
                    ลบ
                  </button>
                </div>

                {!widget.isCollapsed && (
                  <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                    <pre className="overflow-auto text-xs leading-6 text-neutral-600">
                      {JSON.stringify(widget.contentJSON, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
