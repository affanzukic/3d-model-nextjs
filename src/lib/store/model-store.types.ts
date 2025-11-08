export enum ViewMode {
  VIEW_3D = "3D",
  VIEW_2D = "2D",
}

export type ModelId = string;

export type ModelState = {
  id: ModelId;
  label: string;
  src?: string;
  sourceName?: string;
  sourceType?: "builtin" | "upload";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  footprint?: [number, number];
};

export type ModelStoreState = {
  viewMode: ViewMode;
  models: ModelState[];
  selectedModelId?: ModelId;
};

export type ModelStoreActions = {
  setViewMode: (mode: ViewMode) => void;
  selectModel: (id: ModelId) => void;
  addModel: () => ModelId;
  removeModel: (id: ModelId) => void;
  updateModel: (id: ModelId, patch: Partial<ModelState>) => void;
  updateModelTransform: (id: ModelId, transform: Pick<ModelState, "position" | "rotation">) => void;
  updateFootprint: (id: ModelId, footprint: [number, number]) => void;
};

export type ModelStore = ModelStoreState & ModelStoreActions;
