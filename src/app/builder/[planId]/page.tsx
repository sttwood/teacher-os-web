"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BuilderLayout } from "@/features/builder/components/BuilderLayout";
import { useBuilderStore } from "@/features/builder/stores/builder.store";
import { useBuilderAutosave } from "@/features/builder/hooks/useBuilderAutosave";
import { builderApi } from "@/features/builder/api/builder.api";

export default function BuilderPage() {
  const params = useParams<{ planId: string }>();
  const setPlanId = useBuilderStore((state) => state.setPlanId);
  const setWidgets = useBuilderStore((state) => state.setWidgets);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);

  useBuilderAutosave();

  useEffect(() => {
    async function loadWidgets() {
      if (!params?.planId) return;

      try {
        setPlanId(params.planId);
        setSaveStatus("saving");

        const widgets = await builderApi.getWidgets(params.planId);
        setWidgets(widgets);
        setSaveStatus("saved");
      } catch {
        setWidgets([]);
        setSaveStatus("error");
      }
    }

    void loadWidgets();
  }, [params?.planId, setPlanId, setWidgets, setSaveStatus]);

  return <BuilderLayout />;
}
