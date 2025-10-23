import useTurnstile from "@/common/hooks/useTurnstile";

const ShadowTurnstile = ({
  onTokenObtained,
  onError,
  onExpired,
  siteKey,
}: {
  onTokenObtained: (token: string) => void;
  onError?: (e: Error) => void | undefined;
  onExpired?: () => void | undefined;
  siteKey: string;
}) => {
  const { slotRef, slotName } = useTurnstile({
    siteKey,
    onTokenObtained,
    onError: onError || (() => {}),
    onExpired: onExpired || (() => {}),
  });

  return <slot ref={slotRef} name={slotName}></slot>;
};

export default ShadowTurnstile;
