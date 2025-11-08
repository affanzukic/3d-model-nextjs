"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import { TransformControls, useGLTF } from "@react-three/drei";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Euler, Group } from "three";

import type { ModelInstanceProps } from "@/components/workspace/scene-model/types";
import {
  applyTransformToGroup,
  computeFootprint,
  hasCollision,
} from "@/components/workspace/utils";
import { useModelStore } from "@/lib/store";

const ModelInstanceComponent = ({ model }: ModelInstanceProps) => {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<TransformControls>(null);
  const footprintRef = useRef<[number, number] | undefined>(model.footprint);
  const gltf = useGLTF(model.src as string) as GLTF;
  const localScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const updateTransform = useModelStore((state) => state.updateModelTransform);
  const selectModel = useModelStore((state) => state.selectModel);
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const updateFootprint = useModelStore((state) => state.updateFootprint);
  const models = useModelStore((state) => state.models);
  const otherModels = useMemo(
    () => models.filter((storeModel) => storeModel.id !== model.id),
    [model.id, models],
  );

  useEffect(() => {
    if (!localScene) {
      return;
    }
    const nextFootprint = computeFootprint(localScene, model.scale);
    footprintRef.current = nextFootprint;
    updateFootprint(model.id, nextFootprint);
  }, [localScene, model.id, model.scale, model.src, updateFootprint]);

  useEffect(() => {
    applyTransformToGroup(groupRef.current, model.position, model.rotation);
  }, [model.position, model.rotation]);

  const handleObjectChange = useCallback(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const { x, y, z } = group.position;
    const nextPosition: [number, number, number] = [x, Math.max(0, y), z];

    if (hasCollision(nextPosition, footprintRef.current, otherModels)) {
      applyTransformToGroup(groupRef.current, model.position, model.rotation);
      return;
    }

    updateTransform(model.id, {
      position: nextPosition,
      rotation: [group.rotation.x, group.rotation.y, group.rotation.z] as [number, number, number],
    });
  }, [model.id, model.position, model.rotation, otherModels, updateTransform]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    controls.addEventListener("objectChange", handleObjectChange);
    return () => {
      controls.removeEventListener("objectChange", handleObjectChange);
    };
  }, [handleObjectChange]);

  const handleMouseDown = useCallback(() => {
    selectModel(model.id);
  }, [model.id, selectModel]);

  const isSelected = selectedModelId === model.id;
  const isVisible = Boolean(model.src && localScene);

  if (!isVisible) {
    return null;
  }

  return (
    <TransformControls
      ref={controlsRef}
      enabled={isSelected}
      mode="translate"
      position={model.position}
      showY={false}
      onMouseDown={handleMouseDown}
    >
      <group
        ref={groupRef}
        castShadow
        position={model.position}
        receiveShadow
        rotation={model.rotation as Euler}
        scale={model.scale}
      >
        <primitive object={localScene} />
      </group>
    </TransformControls>
  );
};

export const ModelInstance = memo(ModelInstanceComponent);
