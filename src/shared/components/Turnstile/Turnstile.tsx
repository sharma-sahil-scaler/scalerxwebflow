"use client";

import React, { useEffect } from "react";

import type {
  TurnstileInstance,
  TurnstileProps,
} from "@marsidev/react-turnstile";

import { Turnstile } from "@marsidev/react-turnstile";

export default function TurnstileVerification({
  options = {},
  onTokenObtained,
  siteKey,
}: {
  onTokenObtained: (token: string) => void;
  options?: TurnstileProps["options"];
  siteKey: string;
}) {
  const ref = React.useRef<TurnstileInstance>(null);
  const [token, setToken] = React.useState<string | undefined>();

  useEffect(() => {
    if (token) {
      onTokenObtained(token);
    }
  }, [onTokenObtained, token]);

  return (
    <Turnstile
      ref={ref}
      onError={() => ref.current?.reset()}
      onExpire={() => ref.current?.reset()}
      onSuccess={(payload: unknown) => {
        setToken(payload as string);
      }}
      options={options}
      scriptOptions={{
        defer: true,
      }}
      {...{ siteKey }}
    />
  );
}
