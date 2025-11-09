import { Box3, Group, Object3D, Raycaster, Vector3 } from "three";

import type { ModelState } from "@/lib/store";

export const computeFootprint = (scene: Object3D, scale: number) => {
  const boundingBox = new Box3().setFromObject(scene);
  const size = new Vector3();
  boundingBox.getSize(size);
  return [size.x * scale, size.z * scale] as [number, number];
};

export const applyTransformToGroup = (
  group: Group | null,
  position: [number, number, number],
  rotation: [number, number, number],
) => {
  if (!group) {
    return;
  }
  group.position.set(...position);
  group.rotation.set(...rotation);
};

const createCollisionCache = () => ({
  raycaster: new Raycaster(),
  rayOrigin: new Vector3(),
  rayDirection: new Vector3(),
  intersectionPoint: new Vector3(),
  candidateBox: new Box3(),
  targetBox: new Box3(),
});

export type CollisionCache = ReturnType<typeof createCollisionCache>;
const defaultCollisionCache = createCollisionCache();
const COLLISION_EXPANSION = 4;

const buildFootprintBox = (
  box: Box3,
  [x, y, z]: [number, number, number],
  [width, depth]: [number, number],
) => {
  const halfWidth = (width * COLLISION_EXPANSION) / 2;
  const halfDepth = (depth * COLLISION_EXPANSION) / 2;

  box.min.set(x - halfWidth, y - 0.5, z - halfDepth);
  box.max.set(x + halfWidth, y + 2, z + halfDepth);
  console.debug("collision box", { x, y, z, width, depth, boxMin: box.min, boxMax: box.max });
  return box;
};

export const hasCollision = (
  nextPosition: [number, number, number],
  selfFootprint: [number, number] | undefined,
  otherModels: ModelState[],
  cache: CollisionCache = defaultCollisionCache,
) => {
  if (!selfFootprint) {
    return false;
  }

  buildFootprintBox(cache.candidateBox, nextPosition, selfFootprint);

  return otherModels.some((model) => {
    if (!model.footprint) {
      return false;
    }

    buildFootprintBox(cache.targetBox, model.position, model.footprint);

    return cache.candidateBox.intersectsBox(cache.targetBox);
  });
};

export { createCollisionCache };
