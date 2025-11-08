"use client";

import { memo, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, ModeToggle } from "@/components/ui";
import { ModelControlCard } from "@/components/workspace/model-control-card";
import type { WorkspaceStat } from "@/components/workspace/model-workspace/types";
import { ModelCanvas } from "@/components/workspace/scene-canvas";
import { ViewToggle } from "@/components/workspace/view-toggle";
import { useModelStore, ViewMode } from "@/lib/store";

import { MAX_MODELS } from "@/components/workspace/model-workspace/consts";

const ModelWorkspaceComponent = () => {
  const models = useModelStore((state) => state.models);
  const viewMode = useModelStore((state) => state.viewMode);
  const addModel = useModelStore((state) => state.addModel);
  const is3D = viewMode === ViewMode.VIEW_3D;
  const canAddModel = models.length < MAX_MODELS;

  const stats = useMemo<WorkspaceStat[]>(
    () =>
      models.map((model) => ({
        id: model.id,
        position: model.position.map((axis) => axis.toFixed(2)) as WorkspaceStat["position"],
        rotationDeg: (model.rotation[1] * 180) / Math.PI,
      })),
    [models],
  );

  const controlCards = useMemo(
    () => models.map((model) => <ModelControlCard key={model.id} model={model} />),
    [models],
  );

  const statBlocks = useMemo(
    () =>
      stats.map((stat) => (
        <div
          key={stat.id}
          className="flex items-center justify-between rounded-md border px-3 py-2"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.id}</p>
            <p className="font-medium">poz: {stat.position.join(", ")}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">rot (y)</p>
            <p className="font-medium">{stat.rotationDeg.toFixed(0)}°</p>
          </div>
        </div>
      )),
    [stats],
  );

  const handleAddModel = useCallback(() => {
    if (canAddModel) {
      addModel();
    }
  }, [addModel, canAddModel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Zadatak 1</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModeToggle />
          <ViewToggle mode={viewMode} />
          <Button
            disabled={!canAddModel}
            onClick={handleAddModel}
            size="sm"
            variant="outline"
            className="h-10 gap-2 rounded-md px-4"
            aria-label="Dodaj model"
            title={
              canAddModel ? "Dodaj novi slot i dodaj GLB" : "Maksimalno dva modela su dozvoljena"
            }
          >
            <Plus className="h-4 w-4" />
            Dodaj model
          </Button>
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
                <CardTitle className="text-base">Još nema modela</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Klikni &ldquo;Dodaj model&rdquo; koji će se prikazati u sceni.
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
