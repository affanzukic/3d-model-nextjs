"use client";

import { memo } from "react";

import { useModelStore, ViewMode } from "@/lib/store";

const ViewOverlayComponent = () => {
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const viewMode = useModelStore((state) => state.viewMode);
  const is3D = viewMode === ViewMode.VIEW_3D;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3 text-xs text-muted-foreground sm:flex-row sm:justify-between">
      <span className="rounded bg-background/70 px-2 py-1 backdrop-blur">
        Odabrano: {selectedModelId?.toUpperCase() ?? "nema"}
      </span>
      <span className="rounded bg-background/70 px-2 py-1 backdrop-blur">
        {is3D
          ? "Koristi strelice za pomjeranje i miš za orbitu."
          : "Ortografski pogled za precizno pozicioniranje odozgo."}
      </span>
    </div>
  );
};

export const ViewOverlay = memo(ViewOverlayComponent);
