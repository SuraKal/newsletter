import { useSyncExternalStore } from "react";
import { appParams } from "@/lib/app-params";

const listeners = new Set();
let version = 0;

const storageKeyPrefix = `${appParams.storagePrefix}_`;

const emitVersion = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (
      event.storageArea === window.localStorage &&
      event.key?.startsWith(storageKeyPrefix)
    ) {
      emitVersion();
      window.dispatchEvent(
        new CustomEvent("nekedem:store-updated", {
          detail: { key: event.key, crossTab: true },
        }),
      );
    }
  });
}

export function notifyStoreChange(source = "mock-store") {
  emitVersion();
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("nekedem:store-updated", {
        detail: { source, crossTab: false },
      }),
    );
  }
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
