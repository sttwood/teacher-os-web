"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { BuilderLayout } from "@/features/builder/components/BuilderLayout";
import { useBuilderStore } from "@/features/builder/stores/builder.store";
import { useBuilderAutosave } from "@/features/builder/hooks/useBuilderAutosave";
import { builderApi } from "@/features/builder/api/builder.api";
import { plansApi } from "@/features/plans/api/plans.api";
import { ApiError } from "@/lib/api/client";

export default function BuilderPage() {
  const params = useParams<{ planId: string }>();
  const setPlanId = useBuilderStore((state) => state.setPlanId);
  const setPlanMeta = useBuilderStore((state) => state.setPlanMeta);
  const setWidgets = useBuilderStore((state) => state.setWidgets);
  const setSaveStatus = useBuilderStore((state) => state.setSaveStatus);

  useBuilderAutosave();

  useEffect(() => {
    async function loadBuilderData() {
      if (!params?.planId) return;

      try {
        setPlanId(params.planId);
        setSaveStatus("saving");

        const [plan, widgets] = await Promise.all([
          plansApi.getById(params.planId),
          builderApi.getWidgets(params.planId),
        ]);

        setPlanMeta(plan);
        setWidgets(widgets);
        setSaveStatus("saved");
      } catch (error) {
        const apiError = error as ApiError;
        console.error("Failed to load builder data:", apiError.message);
        setPlanMeta(null);
        setWidgets([]);
        setSaveStatus("error");
      }
    }

    void loadBuilderData();
  }, [params?.planId, setPlanId, setPlanMeta, setWidgets, setSaveStatus]);

  return <BuilderLayout />;
}
