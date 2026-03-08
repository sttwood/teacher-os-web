"use client";

import { useEffect, useRef } from "react";
import { builderApi } from "@/features/builder/api/builder.api";
import { useBuilderStore } from "@/features/builder/stores/builder.store";

export function useBuilderAutosave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const planId = useBuilderStore((state) => state.planId);
  const widgets = useBuilderStore((state) => state.widgets);
  const isDirty = useBuilderStore((state) => state.isDirty);
  const setWidgets = useBuilderStore((state) => state.setWidgets);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);
  const setLastSavedAt = useBuilderStore((state) => state.setLastSavedAt);
  const markDirty = useBuilderStore((state) => state.markDirty);

  useEffect(() => {
    if (!planId || !isDirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        setSaveStatus("saving");

        const savedWidgets = await builderApi.saveWidgets(planId, widgets);

        setWidgets(savedWidgets);
        markDirty(false);
        setSaveStatus("saved");
        setLastSavedAt(new Date().toISOString());
      } catch {
        setSaveStatus("error");
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [planId, widgets, isDirty, setWidgets, setSaveStatus, setLastSavedAt, markDirty]);
}