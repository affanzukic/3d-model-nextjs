"use client";

import { memo, useCallback, useMemo } from "react";

import { Toggle } from "@/components/ui";
import type { ViewToggleOption, ViewToggleProps } from "@/components/workspace/view-toggle/types";
import { VIEW_TOGGLE_OPTIONS } from "@/components/workspace/view-toggle/consts";
import { useModelStore, ViewMode } from "@/lib/store";
import { cn } from "@/lib/utils";

type ViewToggleButtonProps = {
  isActive: boolean;
  label: string;
  onSelect: (mode: ViewMode) => void;
  value: ViewMode;
};

const ViewToggleButton = memo(({ isActive, label, onSelect, value }: ViewToggleButtonProps) => {
  const handlePressedChange = useCallback(
    (pressed: boolean) => {
      if (pressed) {
        onSelect(value);
      }
    },
    [onSelect, value],
  );

  return (
    <Toggle
      className={cn(
        "flex-1 h-full rounded-md px-3 text-xs uppercase tracking-wide",
        isActive && "bg-primary text-primary-foreground",
      )}
      pressed={isActive}
      onPressedChange={handlePressedChange}
    >
      {label}
    </Toggle>
  );
});

ViewToggleButton.displayName = "ViewToggleButton";

const ViewToggleComponent = ({ mode }: ViewToggleProps) => {
  const setViewMode = useModelStore((state) => state.setViewMode);

  const handleModeChange = useCallback(
    (nextMode: ViewMode) => {
      setViewMode(nextMode);
    },
    [setViewMode],
  );

  const toggleButtons = useMemo(
    () =>
      VIEW_TOGGLE_OPTIONS.map((option: ViewToggleOption) => (
        <ViewToggleButton
          key={option.value}
          isActive={mode === option.value}
          label={option.label}
          onSelect={handleModeChange}
          value={option.value}
        />
      )),
    [handleModeChange, mode],
  );

  return (
    <div className="inline-flex h-10 items-center rounded-md border bg-card/70 p-1 shadow-sm">
      {toggleButtons}
    </div>
  );
};

export const ViewToggle = memo(ViewToggleComponent);
