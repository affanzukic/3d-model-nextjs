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

const raycaster = new Raycaster();
const rayOrigin = new Vector3();
const rayDirection = new Vector3();
const intersectionPoint = new Vector3();
const candidateBox = new Box3();
const targetBox = new Box3();

const buildFootprintBox = (
  box: Box3,
  [x, y, z]: [number, number, number],
  [width, depth]: [number, number],
) => {
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  box.min.set(x - halfWidth, y - 0.5, z - halfDepth);
  box.max.set(x + halfWidth, y + 0.5, z + halfDepth);
  return box;
};

export const hasCollision = (
  nextPosition: [number, number, number],
  selfFootprint: [number, number] | undefined,
  otherModels: ModelState[],
) => {
  if (!selfFootprint) {
    return false;
  }

  buildFootprintBox(candidateBox, nextPosition, selfFootprint);
  rayOrigin.set(...nextPosition);

  return otherModels.some((model) => {
    if (!model.footprint) {
      return false;
    }

    buildFootprintBox(targetBox, model.position, model.footprint);

    if (candidateBox.intersectsBox(targetBox)) {
      return true;
    }

    rayDirection.set(model.position[0], model.position[1], model.position[2]).sub(rayOrigin);
    const distance = rayDirection.length();
    if (distance === 0) {
      return true;
    }
    rayDirection.normalize();
    raycaster.ray.origin.copy(rayOrigin);
    raycaster.ray.direction.copy(rayDirection);
    const hit = raycaster.ray.intersectBox(targetBox, intersectionPoint);
    return Boolean(hit && hit.distanceTo(rayOrigin) <= distance);
  });
};
