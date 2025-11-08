import type { ViewToggleOption } from "@/components/workspace/view-toggle/types";
import { ViewMode } from "@/lib/store";

export const VIEW_TOGGLE_OPTIONS: ViewToggleOption[] = [
  { label: "3D", value: ViewMode.VIEW_3D },
  { label: "2D", value: ViewMode.VIEW_2D },
];
