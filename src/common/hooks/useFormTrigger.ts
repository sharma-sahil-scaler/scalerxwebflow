import { useEffect } from "react";
import { map } from "nanostores";

export interface FormTriggerData {
  clickSource?: string;
  clickSection?: string;
  intent?: string;
}

export const $formTrigger = map<FormTriggerData>({});

/**
 * Form Trigger Hook
 *
 * Sets up event delegation to capture clicks on form trigger buttons.
 * Call this once in InitialLoad.
 *
 * Usage in HTML/Webflow:
 * <button
 *   class="form-trigger"
 *   data-click-source="hero"
 *   data-click-section="cta"
 * >
 *   Get Started
 * </button>
 *
 * In any component:
 * import { useStore } from "@nanostores/react";
 * import { $formTrigger } from "@/common/hooks/useFormTrigger";
 * const { clickSource, clickSection } = useStore($formTrigger);
 */
export const useFormTriggerListener = () => {
  useEffect(() => {
    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("form-trigger")) {
        console.log("Form trigger clicked", target.dataset);
        $formTrigger.set({
          clickSource: target.dataset.clickSource,
          clickSection: target.dataset.clickSection,
          intent: target.dataset.intent,
        });
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);
};
