"use client";

import type { ChangeEvent, MouseEvent } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Trash2 } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Slider,
} from "@/components/ui";
import type { ModelControlCardProps } from "@/components/workspace/model-control-card/types";
import { useModelStore } from "@/lib/store";
import { cn } from "@/lib/utils";

import { ROTATION_MAX_DEGREES, ROTATION_MIN_DEGREES } from "./consts";

const ModelControlCardComponent = ({ model }: ModelControlCardProps) => {
  const updateModel = useModelStore((state) => state.updateModel);
  const updateModelTransform = useModelStore((state) => state.updateModelTransform);
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const selectModel = useModelStore((state) => state.selectModel);
  const removeModel = useModelStore((state) => state.removeModel);
  const uploadUrlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (uploadUrlRef.current) {
        URL.revokeObjectURL(uploadUrlRef.current);
      }
    },
    [],
  );

  const rotationDegrees = useMemo(
    () => Math.round((model.rotation[1] * 180) / Math.PI),
    [model.rotation],
  );
  const rotationSliderValue = useMemo(() => [rotationDegrees], [rotationDegrees]);

  const handleSelectCard = useCallback(() => {
    selectModel(model.id);
  }, [model.id, selectModel]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      if (uploadUrlRef.current) {
        URL.revokeObjectURL(uploadUrlRef.current);
      }
      uploadUrlRef.current = objectUrl;

      updateModel(model.id, {
        src: objectUrl,
        sourceName: file.name,
        sourceType: "upload",
        label: model.label,
      });
      selectModel(model.id);
    },
    [model.id, model.label, selectModel, updateModel],
  );

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

  const handleRemoveModel = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      removeModel(model.id);
    },
    [model.id, removeModel],
  );

  const hasSource = Boolean(model.src);

  return (
    <Card
      className={cn("transition-colors", selectedModelId === model.id && "border-primary/70")}
      onClick={handleSelectCard}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{model.label}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Izvor: {model.sourceName ?? "Dodaj GLB da započneš"}
          </p>
        </div>
        <Button onClick={handleRemoveModel} size="icon" variant="ghost" aria-label="Ukloni model">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${model.id}-file`}>Zamijeni GLB</Label>
          <Input accept=".glb" id={`${model.id}-file`} type="file" onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground">
            Dodaj GLB da zamijeni {model.label}. Scena se automatski osvježava.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${model.id}-rotation`}>Rotacija (Y osa)</Label>
          <Slider
            disabled={!hasSource}
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
