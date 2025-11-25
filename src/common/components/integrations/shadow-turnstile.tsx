import React, { useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import type {
  TurnstileProps,
  TurnstileInstance,
} from "@marsidev/react-turnstile";

const BotVerification = ({
  onTokenObtained,
  options = {},
  siteKey,
}: {
  onTokenObtained: (token: string) => void;
  options?: TurnstileProps["options"];
  siteKey: string;
}) => {
  const ref = React.useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    if (token) {
      onTokenObtained(token);
    }
  }, [onTokenObtained, token]);

  return (
    <Turnstile
      onSuccess={(payload: string) => {
        setToken(payload);
      }}
      onError={() => ref.current?.reset()}
      onExpire={() => ref.current?.reset()}
      className="my-12"
      {...{ ref, options, siteKey }}
    />
  );
};

export default BotVerification;
