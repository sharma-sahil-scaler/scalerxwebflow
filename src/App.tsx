import ToastHost from "@/common/components/ui/shadow-toast";
import DefaultForm from "@/features/DefaultForm/DefaultForm";
import { ShadowDom } from "@/common/components/others/shadow-dom";
import InitialLoad from "@/features/InitialLoad/InitialLoad";

function App() {
  return (
    <>
      <ToastHost />
      <button
        data-gtm-track
        data-gtm-type="click"
        data-gtm-label="Sign Up Button"
        data-gtm-category="button"
        className="gtm-track-element"
      >
        Sign Up
      </button>

      <section
        className="gtm-track-element hero-section"
        data-gtm-category="section"
        data-gtm-section-name="hero-section"
      >
        <h1>Welcome to Scaler</h1>
        <p>Your content here...</p>
      </section>

      <ShadowDom>
        <InitialLoad product="product" subProduct="subProduct" />
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
