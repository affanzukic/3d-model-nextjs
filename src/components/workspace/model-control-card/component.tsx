"use client";

import { memo, useCallback, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle, Label, Slider } from "@/components/ui";
import type { ModelControlCardProps } from "@/components/workspace/model-control-card/types";
import { useModelStore } from "@/lib/store";
import { cn } from "@/lib/utils";

import { ROTATION_MAX_DEGREES, ROTATION_MIN_DEGREES } from "./consts";

const ModelControlCardComponent = ({ model }: ModelControlCardProps) => {
  const updateModelTransform = useModelStore((state) => state.updateModelTransform);
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const selectModel = useModelStore((state) => state.selectModel);
  const rotationDegrees = useMemo(
    () => Math.round((model.rotation[1] * 180) / Math.PI),
    [model.rotation],
  );
  const rotationSliderValue = useMemo(() => [rotationDegrees], [rotationDegrees]);

  const handleSelectCard = useCallback(() => {
    selectModel(model.id);
  }, [model.id, selectModel]);

  const handleRotationChange = useCallback(
    (values: number[]) => {
      const degrees = values[0] ?? 0;
      const radians = (degrees * Math.PI) / 180;
      updateModelTransform(model.id, {
        rotation: [model.rotation[0], radians, model.rotation[2]],
        position: model.position,
      });
      selectModel(model.id);
    },
    [model.id, model.position, model.rotation, selectModel, updateModelTransform],
  );

  return (
    <Card
      className={cn("transition-colors", selectedModelId === model.id && "border-primary/70")}
      onClick={handleSelectCard}
    >
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-base">{model.label}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Izvor: {model.sourceName ?? "Dodaj GLB da započneš"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${model.id}-rotation`}>Rotacija (Y osa)</Label>
          <Slider
            id={`${model.id}-rotation`}
            max={ROTATION_MAX_DEGREES}
            min={ROTATION_MIN_DEGREES}
            step={1}
            value={rotationSliderValue}
            onValueChange={handleRotationChange}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{ROTATION_MIN_DEGREES}°</span>
            <span>{rotationDegrees}°</span>
            <span>{ROTATION_MAX_DEGREES}°</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ModelControlCard = memo(ModelControlCardComponent);
