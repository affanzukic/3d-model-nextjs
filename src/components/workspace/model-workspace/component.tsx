"use client";

import { memo, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, ModeToggle } from "@/components/ui";
import { ModelControlCard } from "@/components/workspace/model-control-card";
import type { WorkspaceStat } from "@/components/workspace/model-workspace/types";
import { ModelCanvas } from "@/components/workspace/scene-canvas";
import { ViewToggle } from "@/components/workspace/view-toggle";
import { useModelStore, ViewMode } from "@/lib/store";
import { Loader } from "@/components/workspace/loader";
import { StatBlocks } from "@/components/workspace/stat-blocks";

const ModelWorkspaceComponent = () => {
  const [hasHydrated, setHasHydrated] = useState(false);
  const models = useModelStore((state) => state.models);
  const liveTransforms = useModelStore((state) => state.liveTransforms);
  const hydrateTransforms = useModelStore((state) => state.hydrateTransforms);
  const viewMode = useModelStore((state) => state.viewMode);
  const is3D = viewMode === ViewMode.VIEW_3D;

  useEffect(() => {
    if (hasHydrated) {
      return;
    }
    let mounted = true;
    const loadTransforms = async () => {
      const { fetchModelTransforms } = await import("@/lib/services/model-transforms");
      const remoteTransforms = await fetchModelTransforms(models.map((model) => model.id));
      if (!mounted) {
        return;
      }
      hydrateTransforms(remoteTransforms);
      setHasHydrated(true);
    };
    loadTransforms();
    return () => {
      mounted = false;
    };
  }, [hasHydrated, hydrateTransforms, models]);

  const resolvedModels = useMemo(
    () =>
      models.map((model) => {
        const liveTransform = liveTransforms[model.id];
        return liveTransform ? { ...model, ...liveTransform } : model;
      }),
    [liveTransforms, models],
  );

  const stats = useMemo<WorkspaceStat[]>(
    () =>
      resolvedModels.map((model) => ({
        id: model.id,
        label: model.label,
        position: model.position.map((axis) => axis.toFixed(2)) as WorkspaceStat["position"],
        rotationDeg: (model.rotation[1] * 180) / Math.PI,
      })),
    [resolvedModels],
  );

  const controlCards = useMemo(
    () => resolvedModels.map((model) => <ModelControlCard key={model.id} model={model} />),
    [resolvedModels],
  );

  const statBlocks = useMemo(
    () => stats.map(({ id, ...rest }) => <StatBlocks key={id} {...rest} />),
    [stats],
  );

  if (!hasHydrated) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Zadatak 1</h1>
          <p className="text-sm text-muted-foreground">
            Motor i tenk iz <code>/public/models/model1.glb</code> i{" "}
            <code>public/models/model2.glb</code> su odmah dostupni za manipulaciju u 3D i 2D
            prikazu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModeToggle />
          <ViewToggle mode={viewMode} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pregled scene</CardTitle>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {is3D ? "Perspektiva" : "Pogled odozgo"}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video min-h-[420px] w-full bg-muted">
              <ModelCanvas />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {controlCards.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modeli nisu učitani</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lokalni demo modeli bi trebali biti dostupni automatski. Provjeri da li postoje{" "}
                  <code>public/models/model1.glb</code> i <code>public/models/model2.glb</code>.
                </p>
              </CardContent>
            </Card>
          ) : (
            controlCards
          )}

          {stats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trenutne transformacije</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">{statBlocks}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export const ModelWorkspace = memo(ModelWorkspaceComponent);
