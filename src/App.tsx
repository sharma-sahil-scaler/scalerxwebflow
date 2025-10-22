import { useState } from "react";
import ToastHost from "@/shared/components/ToastHost";
import { toast } from "@/shared/stores/toast";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import DefaultForm from "./features/DefaultForm/DefaultForm";
import { ShadowDom } from "./components/ShadowDom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() =>
            toast.show({
              title: "Saved",
              description: "Your changes have been saved.",
              variant: "success",
            })
          }
        >
          Show success toast
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ToastHost />

      <ShadowDom>
        <DefaultForm
          form_subtitle="Powered by Scaler Companion"
          signup_intent="signup"
          otp_intent="otp"
          product="product"
          sub_product="sub_product"
          platform="platform"
          form_title="Talk To a Scaler Career Counsellor"
          turnstile_key="0x4AAAAAAB7N32HVHHzNUVx4"
        />
      </ShadowDom>
    </>
  );
}

export default App;
