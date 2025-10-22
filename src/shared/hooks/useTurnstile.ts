import { useCallback, useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (e: Error) => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const useTurnstile = ({
  siteKey,
  onTokenObtained,
  onError,
  onExpired,
}: {
  siteKey: string;
  onTokenObtained: (token: string) => void;
  onError: (e: Error) => void;
  onExpired: () => void;
}) => {
  const slotRef = useRef<HTMLSlotElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const id = useId();
  const slotName = `turnstile-${id.replace(/:/g, "-")}`;

  const initializeTurnstile = useCallback(() => {
    if (initializedRef.current) {
      console.log("[Turnstile] Already initialized, skipping");
      return;
    }

    if (!containerRef.current) {
      console.log("[Turnstile] No container found, abort init");
      return;
    }

    if (!window.turnstile) {
      console.log("[Turnstile] window.turnstile not ready");
      return;
    }

    console.log("[Turnstile] Rendering widget in", containerRef.current);
    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          console.log("[Turnstile] Token obtained:", token);
          onTokenObtained(token);
        },
        "error-callback": (e: Error) => {
          console.error("[Turnstile] Error callback:", e);
          onError(e);
        },
        "expired-callback": () => {
          console.warn("[Turnstile] Token expired");
          onExpired();
        },
      });
      initializedRef.current = true;
      console.log("[Turnstile] Widget ID:", widgetIdRef.current);
    } catch (e) {
      console.error("[Turnstile] Failed to initialize:", e);
    }
  }, [onError, onExpired, onTokenObtained, siteKey]);

  const cleanupTurnstile = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      console.log("[Turnstile] Cleaning up widget:", widgetIdRef.current);
      try {
        window.turnstile.remove(widgetIdRef.current);
        initializedRef.current = false;
        widgetIdRef.current = null;
      } catch (e) {
        console.error("[Turnstile] Cleanup failed:", e);
      }
    }
  }, []);

  const findShadowHost = useCallback(() => {
    const root = slotRef.current?.getRootNode();
    if (root instanceof ShadowRoot) {
      console.log("[Turnstile] Found ShadowRoot host");
      return root.host as HTMLElement;
    }
    console.log("[Turnstile] No ShadowRoot host");
    return null;
  }, []);

  const findAndInitializeTurnstile = useCallback(() => {
    const shadowHost = findShadowHost();
    const container = shadowHost?.querySelector(`[slot="${slotName}"]`);

    if (!container) {
      console.log("[Turnstile] Creating new container for slot", slotName);
      const newContainer = document.createElement("div");
      newContainer.setAttribute("slot", slotName);
      newContainer.className = "turnstile-container";
      shadowHost?.appendChild(newContainer);
      containerRef.current = newContainer;
    } else {
      console.log("[Turnstile] Reusing existing container for slot", slotName);
      containerRef.current = container as HTMLDivElement;
    }
  }, [findShadowHost, slotName]);

  useEffect(() => {
    console.log("[Turnstile] useEffect mount");
    findAndInitializeTurnstile();

    if (window.turnstile) {
      console.log("[Turnstile] turnstile ready immediately");
      initializeTurnstile();
    } else {
      console.log("[Turnstile] Waiting for turnstile to load");
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          console.log("[Turnstile] turnstile now available");
          clearInterval(checkTurnstile);
          initializeTurnstile();
        }
      }, 1000);

      return () => {
        console.log("[Turnstile] Cleanup interval + widget");
        clearInterval(checkTurnstile);
        cleanupTurnstile();
      };
    }

    return () => {
      console.log("[Turnstile] Effect cleanup");
      cleanupTurnstile();
    };
  }, [cleanupTurnstile, findAndInitializeTurnstile, initializeTurnstile]);

  return {
    slotRef,
    slotName,
  };
};

export default useTurnstile;
