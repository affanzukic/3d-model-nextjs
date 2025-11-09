"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { firebaseEnv, isFirebaseConfigComplete } from "@/lib/env";

export const firebaseApp = isFirebaseConfigComplete
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseEnv)
  : null;

export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const isFirebaseEnabled = Boolean(firestore);
