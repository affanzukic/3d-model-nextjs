import type { ModelState } from "@/lib/store";

export type WorkspaceStat = {
  id: ModelState["id"];
  position: [string, string, string];
  rotationDeg: number;
};
