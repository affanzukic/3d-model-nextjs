import { create } from "zustand";

import { MAX_MODELS } from "@/lib/store/model-store.consts";
import { ModelStore, ModelId, ViewMode } from "@/lib/store/model-store.types";
import { createEmptyModel, findAvailableModelSlot } from "@/lib/store/model-store.utils";

export const useModelStore = create<ModelStore>((set) => ({
  viewMode: ViewMode.VIEW_3D,
  models: [],
  selectedModelId: undefined,
  setViewMode: (mode) => set({ viewMode: mode }),
  selectModel: (id) => set({ selectedModelId: id }),
  addModel: () => {
    let createdId: ModelId = "";
    set((state) => {
      if (state.models.length >= MAX_MODELS) {
        return state;
      }
      const slot = findAvailableModelSlot(state.models);
      if (!slot) {
        return state;
      }
      createdId = slot.id;
      const newModel = createEmptyModel(slot.id, slot.index);
      return {
        models: [...state.models, newModel],
        selectedModelId: slot.id,
      };
    });
    return createdId;
  },
  removeModel: (id) =>
    set((state) => {
      const remaining = state.models.filter((model) => model.id !== id);
      const selectedModelId =
        state.selectedModelId === id ? remaining[0]?.id : state.selectedModelId;
      return { models: remaining, selectedModelId };
    }),
  updateModel: (id, patch) =>
    set((state) => ({
      models: state.models.map((model) => (model.id === id ? { ...model, ...patch } : model)),
    })),
  updateModelTransform: (id, transform) =>
    set((state) => ({
      models: state.models.map((model) => (model.id === id ? { ...model, ...transform } : model)),
    })),
  updateFootprint: (id, footprint) =>
    set((state) => ({
      models: state.models.map((model) => (model.id === id ? { ...model, footprint } : model)),
    })),
}));
