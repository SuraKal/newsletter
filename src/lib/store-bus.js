import { useSyncExternalStore } from "react";

const listeners = new Set();
let version = 0;

export function notifyStoreChange() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeStoreChanges(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getStoreVersion() {
  return version;
}

export function useStoreVersion() {
  return useSyncExternalStore(subscribeStoreChanges, getStoreVersion);
}