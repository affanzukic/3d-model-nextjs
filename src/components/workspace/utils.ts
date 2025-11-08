import { Box3, Group, Object3D, Vector3 } from "three";

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

export const hasCollision = (
  nextPosition: [number, number, number],
  selfFootprint: [number, number] | undefined,
  otherModels: ModelState[],
) => {
  if (!selfFootprint) {
    return false;
  }

  const [nextX, , nextZ] = nextPosition;

  return otherModels.some((model) => {
    if (!model.footprint) {
      return false;
    }

    const [modelX, , modelZ] = model.position;
    const halfX = model.footprint[0] / 2 + selfFootprint[0] / 2;
    const halfZ = model.footprint[1] / 2 + selfFootprint[1] / 2;

    const overlapX = Math.abs(nextX - modelX) < halfX;
    const overlapZ = Math.abs(nextZ - modelZ) < halfZ;

    return overlapX && overlapZ;
  });
};
