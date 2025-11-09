import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import type { ModelId, ModelState } from "@/lib/store";
import { firestore, isFirebaseEnabled } from "@/lib/firebase";

type PersistedTransform = Pick<ModelState, "position" | "rotation">;

const COLLECTION = "models";

export const fetchModelTransforms = async (modelIds: ModelId[]) => {
  if (!isFirebaseEnabled || !firestore || modelIds.length === 0) {
    return {} as Record<ModelId, PersistedTransform>;
  }

  const transforms: Record<ModelId, PersistedTransform> = {};
  await Promise.all(
    modelIds.map(async (modelId) => {
      const snapshot = await getDoc(doc(firestore!, COLLECTION, modelId));
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.data() as Partial<PersistedTransform>;
      if (!data.position || !data.rotation) {
        return;
      }
      transforms[modelId] = {
        position: data.position as PersistedTransform["position"],
        rotation: data.rotation as PersistedTransform["rotation"],
      };
    }),
  );

  return transforms;
};

export const saveModelTransform = async (modelId: ModelId, transform: PersistedTransform) => {
  if (!isFirebaseEnabled || !firestore) {
    return;
  }

  await setDoc(
    doc(firestore, COLLECTION, modelId),
    { ...transform, updatedAt: serverTimestamp() },
    { merge: true },
  );
};
