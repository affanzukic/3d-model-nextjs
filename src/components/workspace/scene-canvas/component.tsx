"use client";

import { Suspense, memo, useMemo } from "react";

import {
  Environment,
  Grid,
  OrthographicCamera,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { ModelInstance } from "@/components/workspace/scene-model";
import { ViewOverlay } from "@/components/workspace/view-overlay";
import type { ModelState } from "@/lib/store";
import { useModelStore, ViewMode } from "@/lib/store";

import { DEFAULT_GRID_SIZE } from "./consts";

const SceneContentsComponent = () => {
  const models = useModelStore((state) => state.models);
  const viewMode = useModelStore((state) => state.viewMode);
  const is3D = viewMode === ViewMode.VIEW_3D;

  const modelInstances = useMemo(
    () =>
      models
        .filter((model) => Boolean(model.src))
        .map((model: ModelState) => <ModelInstance key={model.id} model={model} />),
    [models],
  );

  const orbitControlsConfig = useMemo(
    () => ({
      enablePan: true,
      enableRotate: is3D,
      enableZoom: true,
      maxPolarAngle: is3D ? Math.PI / 2.2 : 0,
      minPolarAngle: 0,
    }),
    [is3D],
  );

  return (
    <>
      <Grid
        args={DEFAULT_GRID_SIZE}
        cellColor="#e2e8f0"
        fadeDistance={30}
        infiniteGrid
        sectionColor="#cbd5f5"
      />
      <Environment preset="city" />
      <OrbitControls {...orbitControlsConfig} />
      {modelInstances}
    </>
  );
};

const SceneContents = memo(SceneContentsComponent);

const ModelCanvasComponent = () => {
  const viewMode = useModelStore((state) => state.viewMode);
  const is3D = viewMode === ViewMode.VIEW_3D;

  return (
    <div className="relative h-full w-full">
      <Canvas dpr={[1, 2]} shadows>
        <color attach="background" args={["#f8fafc"]} />
        {is3D ? (
          <PerspectiveCamera makeDefault fov={45} position={[6, 4.5, 6]} />
        ) : (
          <OrthographicCamera far={50} makeDefault near={0.1} position={[0, 12, 0.001]} zoom={80} />
        )}

        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          intensity={0.8}
          position={[6, 10, 6]}
          shadow-mapSize-height={2048}
          shadow-mapSize-width={2048}
        />

        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </Canvas>
      <ViewOverlay />
    </div>
  );
};

export const ModelCanvas = memo(ModelCanvasComponent);
