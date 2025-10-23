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
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (!window.turnstile) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          onTokenObtained(token);
        },
        "error-callback": (e: Error) => {
          onError(e);
        },
        "expired-callback": () => {
          onExpired();
        },
      });
      initializedRef.current = true;
    } catch (e) {
      onError(e as Error);
    }
  }, [onError, onExpired, onTokenObtained, siteKey]);

  const cleanupTurnstile = useCallback(() => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        initializedRef.current = false;
        widgetIdRef.current = null;
      } catch (e) {
        onError(e as Error);
      }
    }
  }, [onError]);

  const findShadowHost = useCallback(() => {
    const root = slotRef.current?.getRootNode();
    if (root instanceof ShadowRoot) {
      return root.host as HTMLElement;
    }
    return null;
  }, []);

  const findAndInitializeTurnstile = useCallback(() => {
    const shadowHost = findShadowHost();
    const container = shadowHost?.querySelector(`[slot="${slotName}"]`);

    if (!container) {
      const newContainer = document.createElement("div");
      newContainer.setAttribute("slot", slotName);
      newContainer.className = "turnstile-container";
      shadowHost?.appendChild(newContainer);
      containerRef.current = newContainer;
    } else {
      containerRef.current = container as HTMLDivElement;
    }
  }, [findShadowHost, slotName]);

  useEffect(() => {
    findAndInitializeTurnstile();

    if (window.turnstile) {
      initializeTurnstile();
    } else {
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          initializeTurnstile();
        }
      }, 1000);

      return () => {
        clearInterval(checkTurnstile);
        cleanupTurnstile();
      };
    }

    return () => {
      cleanupTurnstile();
    };
  }, [cleanupTurnstile, findAndInitializeTurnstile, initializeTurnstile]);

  return {
    slotRef,
    slotName,
  };
};

export default useTurnstile;
