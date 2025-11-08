import type { ViewMode } from "@/lib/store";

export type ViewToggleProps = {
  mode: ViewMode;
};

export type ViewToggleOption = {
  label: string;
  value: ViewMode;
};
