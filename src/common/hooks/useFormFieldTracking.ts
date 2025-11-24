import { useCallback, useEffect, useRef } from "react";

interface FormFieldTrackingOptions {
  onFieldBlur?: (fieldId: string,  value: string) => void;
}

export const useFormFieldTracking = (
  options: FormFieldTrackingOptions = {},
) => {
  const { onFieldBlur } = options;
  const trackedFieldsRef = useRef<Set<string>>(new Set());

  const handleBlur = useCallback((event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const fieldId = target.getAttribute("data-field-id");

    if (fieldId && onFieldBlur) {
      const value = target.value.trim();
      onFieldBlur(fieldId, value);
    }
  }, [onFieldBlur]);

  useEffect(() => {
    const trackedFields = document.querySelectorAll("[data-field-id]");
    trackedFields.forEach((field) => {
      if (!trackedFieldsRef.current.has(field.id)) {
        field.addEventListener("blur", handleBlur as EventListener);
        trackedFieldsRef.current.add(field.id);
      }
    });

    return () => {
      trackedFields.forEach((field) => {
        field.removeEventListener("blur", handleBlur as EventListener);
        trackedFieldsRef.current.delete(field.id);
      });
    };
  }, [handleBlur, onFieldBlur]);

  return {
    trackField: (element: HTMLElement | null, fieldId: string) => {
      if (element && !trackedFieldsRef.current.has(fieldId)) {
        element.setAttribute("data-field-id", fieldId);
        trackedFieldsRef.current.add(fieldId);
      }
    },
  };
};
