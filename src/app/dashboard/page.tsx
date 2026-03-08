"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { plansApi } from "@/features/plans/api/plans.api";
import type { Plan } from "@/features/plans/types/plan.type";
import { subjectsApi } from "@/features/subjects/api/subjects.api";
import type {
  LearningUnit,
  Subject,
} from "@/features/subjects/types/subject.type";
import { ApiError } from "@/lib/api/client";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthActions();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<LearningUnit[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [serverError, setServerError] = useState("");

  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    subjectGroup: "",
    subjectName: "",
    subjectCode: "",
    gradeLevel: "",
    semester: "",
    academicYear: "",
    schoolName: user?.schoolName ?? "",
    teacherName: user?.fullName ?? "",
  });

  const [unitForm, setUnitForm] = useState({
    unitNo: 1,
    unitTitle: "",
    description: "",
    totalHours: 1,
    orderIndex: 1,
  });

  const loadSubjects = async () => {
    setIsLoadingSubjects(true);

    try {
      const items = await subjectsApi.listSubjects();
      setSubjects(items);
      return items;
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const loadUnits = async (subjectId: string) => {
    if (!subjectId) {
      setUnits([]);
      setSelectedUnitId("");
      return [];
    }

    setIsLoadingUnits(true);

    try {
      const items = await subjectsApi.listUnits(subjectId);
      setUnits(items);
      return items;
    } finally {
      setIsLoadingUnits(false);
    }
  };

  const loadPlans = async () => {
    setIsLoadingPlans(true);

    try {
      const result = await plansApi.list();
      setPlans(result.items);
      return result.items;
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        setServerError("");

        const [subjectItems] = await Promise.all([loadSubjects(), loadPlans()]);

        if (subjectItems.length > 0) {
          setSelectedSubjectId(subjectItems[0].id);
        }
      } catch (error) {
        const apiError = error as ApiError;
        setServerError(apiError.message);
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    async function fetchUnits() {
      try {
        if (!selectedSubjectId) {
          setUnits([]);
          setSelectedUnitId("");
          return;
        }

        setServerError("");
        const items = await loadUnits(selectedSubjectId);
        setSelectedUnitId(items[0]?.id ?? "");
      } catch (error) {
        const apiError = error as ApiError;
        setServerError(apiError.message);
      }
    }

    void fetchUnits();
  }, [selectedSubjectId]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      if (selectedSubjectId && plan.subjectId !== selectedSubjectId)
        return false;
      if (selectedUnitId && plan.learningUnitId !== selectedUnitId)
        return false;
      return true;
    });
  }, [plans, selectedSubjectId, selectedUnitId]);

  const selectedSubject = subjects.find(
    (item) => item.id === selectedSubjectId,
  );
  const selectedUnit = units.find((item) => item.id === selectedUnitId);

  const subjectCount = subjects.length;
  const unitCount = units.length;
  const planCount = filteredPlans.length;

  const handleCreateSubject = async () => {
    try {
      setIsCreatingSubject(true);
      setServerError("");

      const created = await subjectsApi.createSubject({
        subjectGroup: subjectForm.subjectGroup,
        subjectName: subjectForm.subjectName,
        subjectCode: subjectForm.subjectCode,
        gradeLevel: subjectForm.gradeLevel,
        semester: subjectForm.semester,
        academicYear: subjectForm.academicYear,
        schoolName: subjectForm.schoolName,
        teacherName: subjectForm.teacherName,
      });

      const nextSubjects = [created, ...subjects];
      setSubjects(nextSubjects);
      setSelectedSubjectId(created.id);

      setSubjectForm((prev) => ({
        ...prev,
        subjectGroup: "",
        subjectName: "",
        subjectCode: "",
        gradeLevel: "",
        semester: "",
        academicYear: "",
      }));
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const handleCreateUnit = async () => {
    if (!selectedSubjectId) {
      setServerError("กรุณาเลือกรายวิชาก่อนสร้างหน่วยการเรียนรู้");
      return;
    }

    try {
      setIsCreatingUnit(true);
      setServerError("");

      const created = await subjectsApi.createUnit(selectedSubjectId, {
        unitNo: unitForm.unitNo,
        unitTitle: unitForm.unitTitle,
        description: unitForm.description,
        totalHours: unitForm.totalHours,
        orderIndex: unitForm.orderIndex,
      });

      const nextUnits = [...units, created].sort((a, b) => {
        if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
        return a.unitNo - b.unitNo;
      });

      setUnits(nextUnits);
      setSelectedUnitId(created.id);

      setUnitForm({
        unitNo: created.unitNo + 1,
        unitTitle: "",
        description: "",
        totalHours: 1,
        orderIndex: created.orderIndex + 1,
      });
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsCreatingUnit(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!selectedSubject || !selectedUnit) {
      setServerError("กรุณาเลือกรายวิชาและหน่วยการเรียนรู้ก่อนสร้างแผน");
      return;
    }

    try {
      setIsCreatingPlan(true);
      setServerError("");

      const nextLessonNo = filteredPlans.length + 1;

      const created = await plansApi.create({
        subjectId: selectedSubject.id,
        learningUnitId: selectedUnit.id,
        lessonNo: nextLessonNo,
        lessonTitle: `${selectedUnit.unitTitle} - แผนที่ ${nextLessonNo}`,
        lessonHours: 1,
        title: `แผนการจัดการเรียนรู้ที่ ${nextLessonNo}`,
      });

      setPlans((prev) => [created, ...prev]);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ดแผนการจัดการเรียนรู้</h1>
          <p className="mt-1 text-sm text-neutral-600">
            สวัสดี, {user?.fullName ?? "ครูผู้สอน"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-xl border bg-white px-4 py-2 text-sm"
        >
          ออกจากระบบ
        </button>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-neutral-500">รายวิชาทั้งหมด</p>
          <p className="mt-2 text-2xl font-semibold">{subjectCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-neutral-500">
            หน่วยการเรียนรู้ของรายวิชาที่เลือก
          </p>
          <p className="mt-2 text-2xl font-semibold">{unitCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-neutral-500">แผนในหน่วยที่เลือก</p>
          <p className="mt-2 text-2xl font-semibold">{planCount}</p>
        </div>
      </div>
      {/* Selectd context bar */}
      <div className="mb-6 rounded-2xl border bg-white p-4">
        <h2 className="text-base font-semibold">บริบทที่กำลังทำงาน</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              รายวิชา
            </p>
            <p className="mt-1 text-sm font-medium">
              {selectedSubject
                ? `${selectedSubject.subjectName} (${selectedSubject.gradeLevel})`
                : "ยังไม่ได้เลือกรายวิชา"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              หน่วยการเรียนรู้
            </p>
            <p className="mt-1 text-sm font-medium">
              {selectedUnit
                ? `หน่วยที่ ${selectedUnit.unitNo} ${selectedUnit.unitTitle}`
                : "ยังไม่ได้เลือกหน่วยการเรียนรู้"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              สถานะ
            </p>
            <p className="mt-1 text-sm font-medium">
              {selectedSubject && selectedUnit
                ? "พร้อมสร้างแผนการจัดการเรียนรู้"
                : "กรุณาเลือกรายวิชาและหน่วยการเรียนรู้"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border bg-white p-4 lg:col-span-4">
          <h2 className="text-lg font-semibold">รายวิชา ({subjectCount})</h2>
          <p className="mt-1 text-sm text-neutral-500">
            เลือกรายวิชาเพื่อดูหน่วยการเรียนรู้
          </p>

          <div className="mt-4 rounded-2xl border bg-neutral-50 p-4">
            <h3 className="text-sm font-semibold">สร้างรายวิชาใหม่</h3>

            <div className="mt-3 grid gap-3">
              <input
                value={subjectForm.subjectGroup}
                onChange={(e) =>
                  setSubjectForm((prev) => ({
                    ...prev,
                    subjectGroup: e.target.value,
                  }))
                }
                placeholder="กลุ่มสาระ เช่น ภาษาไทย"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={subjectForm.subjectName}
                onChange={(e) =>
                  setSubjectForm((prev) => ({
                    ...prev,
                    subjectName: e.target.value,
                  }))
                }
                placeholder="ชื่อรายวิชา"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={subjectForm.subjectCode}
                onChange={(e) =>
                  setSubjectForm((prev) => ({
                    ...prev,
                    subjectCode: e.target.value,
                  }))
                }
                placeholder="รหัสวิชา"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <input
                value={subjectForm.gradeLevel}
                onChange={(e) =>
                  setSubjectForm((prev) => ({
                    ...prev,
                    gradeLevel: e.target.value,
                  }))
                }
                placeholder="ระดับชั้น"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={subjectForm.semester}
                  onChange={(e) =>
                    setSubjectForm((prev) => ({
                      ...prev,
                      semester: e.target.value,
                    }))
                  }
                  placeholder="ภาคเรียน"
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                />

                <input
                  value={subjectForm.academicYear}
                  onChange={(e) =>
                    setSubjectForm((prev) => ({
                      ...prev,
                      academicYear: e.target.value,
                    }))
                  }
                  placeholder="ปีการศึกษา"
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleCreateSubject()}
              disabled={isCreatingSubject}
              className="mt-3 rounded-xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {isCreatingSubject ? "กำลังสร้างรายวิชา..." : "สร้างรายวิชา"}
            </button>
          </div>

          {isLoadingSubjects ? (
            <p className="mt-4 text-sm text-neutral-500">กำลังโหลดรายวิชา...</p>
          ) : subjects.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed p-6">
              <p className="text-sm font-medium">ยังไม่มีรายวิชา</p>
              <p className="mt-1 text-sm text-neutral-500">
                เริ่มต้นโดยสร้างรายวิชาแรกของคุณในฟอร์มด้านบน
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {subjects.map((subject) => {
                const isSelected = subject.id === selectedSubjectId;

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`block w-full rounded-2xl border p-4 text-left ${
                      isSelected
                        ? "border-black bg-neutral-50 ring-2 ring-black/5"
                        : "bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <h3 className="font-medium">{subject.subjectName}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {subject.subjectGroup} • {subject.gradeLevel}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      รหัสวิชา {subject.subjectCode || "-"} • ภาคเรียน{" "}
                      {subject.semester || "-"} • ปี{" "}
                      {subject.academicYear || "-"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-4 lg:col-span-4">
          <h2 className="text-lg font-semibold">
            หน่วยการเรียนรู้ ({unitCount})
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            แสดงหน่วยการเรียนรู้ของรายวิชาที่เลือก
          </p>

          <div className="mt-4 rounded-2xl border bg-neutral-50 p-4">
            <h3 className="text-sm font-semibold">สร้างหน่วยการเรียนรู้ใหม่</h3>

            <div className="mt-3 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={unitForm.unitNo}
                  onChange={(e) =>
                    setUnitForm((prev) => ({
                      ...prev,
                      unitNo: Number(e.target.value),
                    }))
                  }
                  placeholder="หน่วยที่"
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                />

                <input
                  type="number"
                  value={unitForm.totalHours}
                  onChange={(e) =>
                    setUnitForm((prev) => ({
                      ...prev,
                      totalHours: Number(e.target.value),
                    }))
                  }
                  placeholder="จำนวนชั่วโมง"
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>

              <input
                value={unitForm.unitTitle}
                onChange={(e) =>
                  setUnitForm((prev) => ({
                    ...prev,
                    unitTitle: e.target.value,
                  }))
                }
                placeholder="ชื่อหน่วยการเรียนรู้"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />

              <textarea
                value={unitForm.description}
                onChange={(e) =>
                  setUnitForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="คำอธิบายหน่วยการเรียนรู้"
                className="min-h-22 rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => void handleCreateUnit()}
              disabled={!selectedSubjectId || isCreatingUnit}
              className="mt-3 rounded-xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {isCreatingUnit ? "กำลังสร้างหน่วย..." : "สร้างหน่วยการเรียนรู้"}
            </button>
          </div>

          {isLoadingUnits ? (
            <p className="mt-4 text-sm text-neutral-500">
              กำลังโหลดหน่วยการเรียนรู้...
            </p>
          ) : units.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed p-6">
              <p className="text-sm font-medium">ยังไม่มีหน่วยการเรียนรู้</p>
              <p className="mt-1 text-sm text-neutral-500">
                สร้างหน่วยการเรียนรู้สำหรับรายวิชาที่เลือกจากฟอร์มด้านบน
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {units.map((unit) => {
                const isSelected = unit.id === selectedUnitId;

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`block w-full rounded-2xl border p-4 text-left ${
                      isSelected
                        ? "border-black bg-neutral-50 ring-2 ring-black/5"
                        : "bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <h3 className="font-medium">
                      หน่วยที่ {unit.unitNo} {unit.unitTitle}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {unit.description || "ไม่มีคำอธิบาย"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {unit.totalHours} ชั่วโมง
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-4 lg:col-span-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                แผนการจัดการเรียนรู้ ({planCount})
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                แผนภายใต้หน่วยที่เลือก
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleCreatePlan()}
              disabled={!selectedSubjectId || !selectedUnitId || isCreatingPlan}
              className="rounded-xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {isCreatingPlan ? "กำลังสร้าง..." : "สร้างแผนใหม่"}
            </button>
          </div>

          {isLoadingPlans ? (
            <p className="mt-4 text-sm text-neutral-500">
              กำลังโหลดแผนการจัดการเรียนรู้...
            </p>
          ) : !selectedUnit ? (
            <p className="mt-4 text-sm text-neutral-500">
              กรุณาเลือกหน่วยการเรียนรู้ก่อน
            </p>
          ) : filteredPlans.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed p-6">
              <p className="text-sm">ยังไม่มีแผนในหน่วยนี้</p>
              <p className="mt-1 text-sm text-neutral-500">
                เริ่มต้นด้วยการสร้างแผนการจัดการเรียนรู้ฉบับแรก
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredPlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/builder/${plan.id}`}
                  className="block rounded-2xl border p-4 transition hover:bg-neutral-50"
                >
                  <h3 className="font-medium">{plan.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    แผนที่ {plan.lessonNo} • {plan.lessonTitle}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {plan.lessonHours} ชั่วโมง • สถานะ {plan.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
