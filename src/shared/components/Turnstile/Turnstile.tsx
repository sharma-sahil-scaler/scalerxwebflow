import { useCallback } from "react";
import useTurnstile from "@/shared/hooks/useTurnstile";

const ShadowTurnstile = ({
  onTokenObtained,
  siteKey,
}: {
  siteKey: string;
  onTokenObtained: (token: string) => void;
}) => {
  const handleError = useCallback((e: Error) => {
    console.error("Turnstile error:", e.message);
  }, []);

  const handleExpired = useCallback(() => {
    console.error("Turnstile expired");
  }, []);

  const { slotRef, slotName } = useTurnstile({
    siteKey,
    onTokenObtained,
    onError: handleError,
    onExpired: handleExpired,
  });

  return <slot ref={slotRef} name={slotName}></slot>;
};

export default ShadowTurnstile;
