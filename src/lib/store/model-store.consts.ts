import type { ModelState } from "./model-store.types";

export const INITIAL_MODELS: ModelState[] = [
  {
    id: "model1",
    label: "Engine",
    src: "/models/model1.glb",
    sourceName: "Engine (model1.glb)",
    sourceType: "builtin",
    position: [-4, 0, -1.2],
    rotation: [0, 0, 0],
    scale: 1,
  },
  {
    id: "model2",
    label: "Tank",
    src: "/models/model2.glb",
    sourceName: "Tank (model2.glb)",
    sourceType: "builtin",
    position: [4, 0, 1.2],
    rotation: [0, 0, 0],
    scale: 1,
  },
];
