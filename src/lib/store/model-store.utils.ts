import type { ModelId, ModelState } from "@/lib/store";
import { MAX_MODELS, MODEL_ID_PREFIX } from "@/lib/store";

export const createEmptyModel = (id: ModelId, index: number): ModelState => ({
  id,
  label: `Model ${index}`,
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 1,
});

export const findAvailableModelSlot = (models: ModelState[]) => {
  for (let index = 1; index <= MAX_MODELS; index += 1) {
    const candidateId = `${MODEL_ID_PREFIX}${index}`;
    const exists = models.some((model) => model.id === candidateId);
    if (!exists) {
      return { id: candidateId, index };
    }
  }
  return null;
};
