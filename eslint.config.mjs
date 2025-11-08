import structuredClonePolyfill from "@ungap/structured-clone";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = structuredClonePolyfill;
}

if (typeof AbortSignal !== "undefined" && !AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function throwIfAbortedPolyfill() {
    if (this.aborted) {
      throw this.reason ?? new Error("Operation aborted");
    }
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
