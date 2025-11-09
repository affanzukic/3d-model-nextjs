"use client";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import { TransformControls, useGLTF } from "@react-three/drei";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { TransformControls as TransformControlsImpl } from "three-stdlib";
import { Euler, Group } from "three";

import type { ModelInstanceProps } from "@/components/workspace/scene-model/types";
import {
  applyTransformToGroup,
  computeFootprint,
  // hasCollision,
} from "@/components/workspace/utils";
import { useModelStore, ViewMode } from "@/lib/store";

const ModelInstanceComponent = ({ model }: ModelInstanceProps) => {
  const groupRef = useRef<Group>(null);
  const controlsRef = useRef<TransformControlsImpl | null>(null);
  const attachControlsRef = useCallback((instance: TransformControlsImpl | null) => {
    controlsRef.current = instance;
  }, []);
  const footprintRef = useRef<[number, number] | undefined>(model.footprint);
  const gltf = useGLTF(model.src as string) as unknown as GLTF;
  const localScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const updateTransform = useModelStore((state) => state.updateModelTransform);
  const selectModel = useModelStore((state) => state.selectModel);
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const updateFootprint = useModelStore((state) => state.updateFootprint);
  const setCameraLocked = useModelStore((state) => state.setCameraLocked);
  const viewMode = useModelStore((state) => state.viewMode);
  const is3DView = viewMode === ViewMode.VIEW_3D;
  // const models = useModelStore((state) => state.models);
  // const otherModels = useMemo(
  //   () => models.filter((storeModel) => storeModel.id !== model.id),
  //   [model.id, models],
  // );

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
    const { x, y, z } = group.parent?.position ?? {
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
    };
    const nextPosition: [number, number, number] = [x, y, z];

    applyTransformToGroup(groupRef.current, model.position, model.rotation);

    // TODO: fix collision detection
    // if (hasCollision(nextPosition, footprintRef.current, otherModels)) {
    //   applyTransformToGroup(groupRef.current, model.position, model.rotation);
    //   return;
    // }

    updateTransform(model.id, {
      position: nextPosition,
      rotation: [group.rotation.x, group.rotation.y, group.rotation.z] as [number, number, number],
    });
  }, [model.id, model.position, model.rotation, updateTransform]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    const controlsWithEvents = controls as unknown as {
      addEventListener: (event: string, cb: () => void) => void;
      removeEventListener: (event: string, cb: () => void) => void;
    };
    controlsWithEvents.addEventListener("objectChange", handleObjectChange);
    return () => {
      controlsWithEvents.removeEventListener("objectChange", handleObjectChange);
    };
  }, [handleObjectChange]);

  const handleMouseDown = useCallback(() => {
    selectModel(model.id);
    if (is3DView) {
      setCameraLocked(true);
    }
  }, [is3DView, model.id, selectModel, setCameraLocked]);

  const handleMouseUp = useCallback(() => {
    if (is3DView) {
      setCameraLocked(false);
    }
  }, [is3DView, setCameraLocked]);

  const isSelected = selectedModelId === model.id;
  const isVisible = Boolean(model.src && localScene);

  if (!isVisible) {
    return null;
  }

  return (
    <TransformControls
      ref={attachControlsRef}
      enabled={isSelected}
      mode="translate"
      position={model.position}
      showY
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <group
        ref={groupRef}
        castShadow
        position={model.position}
        receiveShadow
        rotation={model.rotation as unknown as Euler}
        scale={model.scale}
      >
        <primitive object={localScene} />
      </group>
    </TransformControls>
  );
};

export const ModelInstance = memo(ModelInstanceComponent);
