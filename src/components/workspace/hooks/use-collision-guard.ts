"use client";

import { useMemo, type MutableRefObject } from "react";

import type { ModelState } from "@/lib/store";
import {
  createCollisionCache,
  type CollisionCache,
  hasCollision,
} from "@/components/workspace/utils";

type UseCollisionGuardParams = {
  footprintRef: MutableRefObject<[number, number] | undefined>;
  otherModels: ModelState[];
};

export const useCollisionGuard = ({ footprintRef, otherModels }: UseCollisionGuardParams) => {
  const collisionCache = useMemo<CollisionCache>(() => createCollisionCache(), []);

  return (nextPosition: [number, number, number]) =>
    hasCollision(nextPosition, footprintRef.current, otherModels, collisionCache);
};
