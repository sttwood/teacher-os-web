"use client";

import { WIDGET_LIBRARY } from "@/features/builder/constants/widget-library";
import { useBuilderStore } from "@/features/builder/stores/builder.store";

export function WidgetLibrary() {
  const addWidget = useBuilderStore((state) => state.addWidget);

  return (
    <aside className="h-full bg-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">คลังวิดเจ็ต</h2>
        <p className="mt-1 text-sm text-neutral-500">
          คลิกเพื่อเพิ่มหัวข้อของแผนการจัดการเรียนรู้ลงในพื้นที่ทำงาน
        </p>
      </div>

      <div className="space-y-3">
        {WIDGET_LIBRARY.map((item) => (
          <button
            key={item.widgetType}
            type="button"
            onClick={() => addWidget(item.widgetType)}
            className="block w-full rounded-2xl border bg-neutral-50 p-4 text-left shadow-sm transition hover:bg-neutral-100 hover:shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{item.label}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] text-neutral-500">
                เพิ่ม
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
