"use client";

import { useBuilderStore } from "@/features/builder/stores/builder.store";

export function InspectorPanel() {
  const planMeta = useBuilderStore((state) => state.planMeta);
  const widgets = useBuilderStore((state) => state.widgets);
  const selectedWidgetId = useBuilderStore((state) => state.selectedWidgetId);
  const isDirty = useBuilderStore((state) => state.isDirty);
  const updateWidgetTitle = useBuilderStore((state) => state.updateWidgetTitle);
  const updateWidgetContent = useBuilderStore(
    (state) => state.updateWidgetContent,
  );

  const selectedWidget = widgets.find(
    (widget) => widget.id === selectedWidgetId,
  );

  const handleContentFieldChange = (key: string, value: unknown) => {
    if (!selectedWidget) return;

    updateWidgetContent(selectedWidget.id, {
      ...selectedWidget.contentJSON,
      [key]: value,
    });
  };

  const getMultilineValue = (value: unknown) => {
    if (!Array.isArray(value)) return "";
    return value.map((item) => String(item ?? "")).join("\n");
  };

  const toStringArray = (value: string) => {
    return value.split("\n").map((item) => item.replace(/\r/g, ""));
  };

  return (
    <aside className="h-full bg-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">รายละเอียดวิดเจ็ต</h2>
        <p className="mt-1 text-sm text-neutral-500">
          ตรวจสอบและแก้ไขข้อมูลของวิดเจ็ตที่เลือก
        </p>
      </div>

      <div className="mb-4 rounded-2xl border bg-neutral-50 p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          แผนการจัดการเรียนรู้
        </p>
        <p className="mt-2 text-sm font-medium">{planMeta?.title || "-"}</p>
        <p className="mt-1 text-xs text-neutral-500">
          {planMeta?.lessonTitle || "-"}
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
            เลือกวิดเจ็ตในพื้นที่ทำงานเพื่อแก้ไขรายละเอียด
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <label className="text-xs uppercase tracking-wide text-neutral-500">
              ชื่อหัวข้อ
            </label>
            <input
              value={selectedWidget.title}
              onChange={(e) =>
                updateWidgetTitle(selectedWidget.id, e.target.value)
              }
              className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </div>

          <div className="rounded-2xl border bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              ประเภทวิดเจ็ต
            </p>
            <p className="mt-2 text-sm font-medium">
              {selectedWidget.widgetType}
            </p>
          </div>

          {selectedWidget.widgetType === "basicInfo" && (
            <div className="rounded-2xl border bg-neutral-50 p-4 space-y-3">
              <h3 className="text-sm font-semibold">ข้อมูลทั่วไป</h3>

              <input
                value={String(
                  selectedWidget.contentJSON["ชื่อแผนการจัดการเรียนรู้"] ?? "",
                )}
                onChange={(e) =>
                  handleContentFieldChange(
                    "ชื่อแผนการจัดการเรียนรู้",
                    e.target.value,
                  )
                }
                placeholder="ชื่อแผนการจัดการเรียนรู้"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={String(selectedWidget.contentJSON["รายวิชา"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("รายวิชา", e.target.value)
                }
                placeholder="รายวิชา"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={String(selectedWidget.contentJSON["ระดับชั้น"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("ระดับชั้น", e.target.value)
                }
                placeholder="ระดับชั้น"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={String(selectedWidget.contentJSON["เรื่อง"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("เรื่อง", e.target.value)
                }
                placeholder="เรื่อง"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={String(selectedWidget.contentJSON["เวลาเรียน"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("เวลาเรียน", e.target.value)
                }
                placeholder="เวลาเรียน"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </div>
          )}

          {selectedWidget.widgetType === "objective" && (
            <div className="rounded-2xl border bg-neutral-50 p-4 space-y-3">
              <h3 className="text-sm font-semibold">จุดประสงค์การเรียนรู้</h3>

              <textarea
                value={String(selectedWidget.contentJSON["สาระสำคัญ"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("สาระสำคัญ", e.target.value)
                }
                placeholder="สาระสำคัญ"
                className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <textarea
                value={getMultilineValue(
                  selectedWidget.contentJSON["จุดประสงค์การเรียนรู้"],
                )}
                onChange={(e) =>
                  handleContentFieldChange(
                    "จุดประสงค์การเรียนรู้",
                    toStringArray(e.target.value),
                  )
                }
                placeholder="พิมพ์จุดประสงค์การเรียนรู้ แยกบรรทัดละ 1 ข้อ"
                className="min-h-30 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </div>
          )}

          {selectedWidget.widgetType === "activity" && (
            <div className="rounded-2xl border bg-neutral-50 p-4 space-y-3">
              <h3 className="text-sm font-semibold">กิจกรรมการเรียนรู้</h3>

              <textarea
                value={getMultilineValue(
                  selectedWidget.contentJSON["กิจกรรมย่อย"],
                )}
                onChange={(e) =>
                  handleContentFieldChange(
                    "กิจกรรมย่อย",
                    toStringArray(e.target.value),
                  )
                }
                placeholder="พิมพ์กิจกรรมย่อย แยกบรรทัดละ 1 ข้อ"
                className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <textarea
                value={String(
                  selectedWidget.contentJSON["ขั้นนำเข้าสู่บทเรียน"] ?? "",
                )}
                onChange={(e) =>
                  handleContentFieldChange(
                    "ขั้นนำเข้าสู่บทเรียน",
                    e.target.value,
                  )
                }
                placeholder="ขั้นนำเข้าสู่บทเรียน"
                className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <textarea
                value={String(
                  selectedWidget.contentJSON["ขั้นจัดกิจกรรมการเรียนรู้"] ?? "",
                )}
                onChange={(e) =>
                  handleContentFieldChange(
                    "ขั้นจัดกิจกรรมการเรียนรู้",
                    e.target.value,
                  )
                }
                placeholder="ขั้นจัดกิจกรรมการเรียนรู้"
                className="min-h-30 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <textarea
                value={String(selectedWidget.contentJSON["ขั้นสรุป"] ?? "")}
                onChange={(e) =>
                  handleContentFieldChange("ขั้นสรุป", e.target.value)
                }
                placeholder="ขั้นสรุป"
                className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </div>
          )}

          {selectedWidget.widgetType === "standardIndicator" && (
            <div className="space-y-4 rounded-2xl border bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold">มาตรฐาน / ตัวชี้วัด</h3>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  มาตรฐานการเรียนรู้
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["มาตรฐานการเรียนรู้"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "มาตรฐานการเรียนรู้",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  ตัวชี้วัด
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["ตัวชี้วัด"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "ตัวชี้วัด",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  สมรรถนะสำคัญของผู้เรียน
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["สมรรถนะสำคัญของผู้เรียน"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "สมรรถนะสำคัญของผู้เรียน",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  คุณลักษณะอันพึงประสงค์
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["คุณลักษณะอันพึงประสงค์"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "คุณลักษณะอันพึงประสงค์",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {selectedWidget.widgetType === "mediaMaterial" && (
            <div className="space-y-4 rounded-2xl border bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold">สื่อ / แหล่งการเรียนรู้</h3>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  สื่อการเรียนรู้
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["สื่อการเรียนรู้"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "สื่อการเรียนรู้",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 รายการ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  อุปกรณ์
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["อุปกรณ์"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "อุปกรณ์",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 รายการ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  แหล่งการเรียนรู้
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["แหล่งการเรียนรู้"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "แหล่งการเรียนรู้",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 รายการ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {selectedWidget.widgetType === "assessment" && (
            <div className="space-y-4 rounded-2xl border bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold">การวัดและประเมินผล</h3>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  วิธีการวัดและประเมินผล
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["วิธีการวัดและประเมินผล"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "วิธีการวัดและประเมินผล",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  เครื่องมือ
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["เครื่องมือ"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "เครื่องมือ",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  เกณฑ์การประเมิน
                </label>
                <textarea
                  value={getMultilineValue(
                    selectedWidget.contentJSON["เกณฑ์การประเมิน"],
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "เกณฑ์การประเมิน",
                      toStringArray(e.target.value),
                    )
                  }
                  placeholder="พิมพ์แยกบรรทัดละ 1 ข้อ"
                  className="min-h-25 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {selectedWidget.widgetType === "homework" && (
            <div className="space-y-4 rounded-2xl border bg-neutral-50 p-4">
              <h3 className="text-sm font-semibold">
                ชิ้นงาน / ภาระงาน / บันทึกหลังสอน
              </h3>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  ชิ้นงานหรือภาระงาน
                </label>
                <textarea
                  value={String(
                    selectedWidget.contentJSON["ชิ้นงานหรือภาระงาน"] ?? "",
                  )}
                  onChange={(e) =>
                    handleContentFieldChange(
                      "ชิ้นงานหรือภาระงาน",
                      e.target.value,
                    )
                  }
                  placeholder="ชิ้นงานหรือภาระงาน"
                  className="min-h-22.5 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  งานที่มอบหมาย
                </label>
                <textarea
                  value={String(
                    selectedWidget.contentJSON["งานที่มอบหมาย"] ?? "",
                  )}
                  onChange={(e) =>
                    handleContentFieldChange("งานที่มอบหมาย", e.target.value)
                  }
                  placeholder="งานที่มอบหมาย"
                  className="min-h-22.5 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  บันทึกหลังสอน
                </label>
                <textarea
                  value={String(
                    selectedWidget.contentJSON["บันทึกหลังสอน"] ?? "",
                  )}
                  onChange={(e) =>
                    handleContentFieldChange("บันทึกหลังสอน", e.target.value)
                  }
                  placeholder="บันทึกหลังสอน"
                  className="min-h-30 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-500">
                  หมายเหตุ
                </label>
                <textarea
                  value={String(selectedWidget.contentJSON["หมายเหตุ"] ?? "")}
                  onChange={(e) =>
                    handleContentFieldChange("หมายเหตุ", e.target.value)
                  }
                  placeholder="หมายเหตุ"
                  className="min-h-22.5 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
