import type { WidgetLibraryItem } from "@/features/builder/types/builder.type";

export const WIDGET_LIBRARY: WidgetLibraryItem[] = [
  {
    widgetType: "basicInfo",
    label: "ข้อมูลทั่วไป",
    description: "ชื่อแผน รายวิชา ระดับชั้น ภาคเรียน ปีการศึกษา หน่วยการเรียนรู้ และเวลาเรียน",
  },
  {
    widgetType: "objective",
    label: "จุดประสงค์การเรียนรู้",
    description: "ผลลัพธ์การเรียนรู้ที่คาดหวังและรายการจุดประสงค์",
  },
  {
    widgetType: "standardIndicator",
    label: "มาตรฐาน / ตัวชี้วัด",
    description: "มาตรฐานการเรียนรู้ ตัวชี้วัด และสมรรถนะสำคัญ",
  },
  {
    widgetType: "activity",
    label: "กิจกรรมการเรียนรู้",
    description: "ขั้นนำ ขั้นสอน ขั้นสรุป และลำดับกิจกรรม",
  },
  {
    widgetType: "mediaMaterial",
    label: "สื่อ / แหล่งการเรียนรู้",
    description: "สื่อ อุปกรณ์ และแหล่งการเรียนรู้ที่ใช้ในแผน",
  },
  {
    widgetType: "assessment",
    label: "การวัดและประเมินผล",
    description: "วิธีการ เครื่องมือ และเกณฑ์การประเมิน",
  },
  {
    widgetType: "homework",
    label: "ชิ้นงาน / ภาระงาน / บันทึกหลังสอน",
    description: "งานที่มอบหมาย หมายเหตุ และบันทึกหลังการจัดการเรียนรู้",
  },
];