import { create } from "zustand";

import { INITIAL_MODELS } from "@/lib/store/model-store.consts";
import { ModelId, ModelState, ModelStore, ViewMode } from "@/lib/store/model-store.types";

export const useModelStore = create<ModelStore>((set) => ({
  viewMode: ViewMode.VIEW_3D,
  models: INITIAL_MODELS,
  selectedModelId: INITIAL_MODELS[0]?.id,
  isCameraLocked: false,
  liveTransforms: {},
  setViewMode: (mode) => set({ viewMode: mode }),
  selectModel: (id) => set({ selectedModelId: id }),
  updateModelTransform: (id, transform) =>
    set((state) => ({
      liveTransforms: { ...state.liveTransforms, [id]: transform },
      isCameraLocked: state.viewMode === ViewMode.VIEW_3D ? true : state.isCameraLocked,
    })),
  updateFootprint: (id, footprint) =>
    set((state) => ({
      models: state.models.map((model) => (model.id === id ? { ...model, footprint } : model)),
    })),
  hydrateTransforms: (transforms) =>
    set((state) => ({
      models: state.models.map((model) =>
        transforms[model.id] ? { ...model, ...transforms[model.id] } : model,
      ),
    })),
  commitLiveTransforms: (modelIds) => {
    const committed: Array<[ModelId, Pick<ModelState, "position" | "rotation">]> = [];
    set((state) => {
      const idsToCommit = modelIds ?? Object.keys(state.liveTransforms);
      if (idsToCommit.length === 0) {
        return state;
      }
      const liveTransforms = { ...state.liveTransforms };
      const models = state.models.map((model) => {
        if (!idsToCommit.includes(model.id)) {
          return model;
        }
        const pending = liveTransforms[model.id];
        if (!pending) {
          return model;
        }
        delete liveTransforms[model.id];
        committed.push([model.id, pending]);
        return { ...model, ...pending };
      });
      return { models, liveTransforms };
    });
    return committed;
  },
  setCameraLocked: (locked) => set({ isCameraLocked: locked }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("pointerup", () => {
    const state = useModelStore.getState();
    const committed = state.commitLiveTransforms();
    if (state.isCameraLocked) {
      useModelStore.setState({ isCameraLocked: false });
    }
    if (committed.length > 0) {
      void (async () => {
        const { saveModelTransform } = await import("@/lib/services/model-transforms");
        await Promise.all(
          committed.map(([modelId, transform]) => saveModelTransform(modelId, transform)),
        );
      })();
    }
  });
}
