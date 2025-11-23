import { useEffect, useCallback, useRef } from "react";
import tracker from "@/common/utils/tracker";

interface TrackingAttributes {
  element_id?: string;
  element_class?: string;
  element_text?: string;
  category?: string;
  label?: string;
  [key: string]: string | undefined;
}

/**
 * Analytics Handler Hook - Optimized Version
 *
 * Automatically tracks button clicks and section views using GTM.
 * Uses useCallback for memory optimization and better performance.
 *
 * Usage in HTML/Webflow:
 *
 * Add class "gtm-track-element" to any element you want to track.
 * Use data-gtm-category to specify if it's a "button" or "section".
 *
 * For button clicks:
 * <button
 *   class="gtm-track-element"
 *   data-gtm-category="button"
 *   data-gtm-label="Sign Up Button"
 * >
 *   Sign Up
 * </button>
 *
 * For section views:
 * <section
 *   class="gtm-track-element"
 *   data-gtm-category="section"
 *   data-gtm-label="Hero Section"
 * >
 *   Content...
 * </section>
 *
 * Additional attributes (optional):
 * - data-gtm-label: Custom label for the element
 * - data-gtm-*: Any custom attribute (will be extracted)
 */
export const useAnalyticsHandler = () => {
  const viewedSectionsRef = useRef<Set<Element>>(new Set());

  const extractAttributes = useCallback(
    (element: Element): TrackingAttributes => {
      const attributes: TrackingAttributes = {};
      const dataset = (element as HTMLElement).dataset;

      if (element.id) attributes.element_id = element.id;
      if (element.className) attributes.element_class = element.className;

      const text = element.textContent?.trim().substring(0, 100);
      if (text) attributes.element_text = text;

      Object.keys(dataset).forEach((key) => {
        if (key.startsWith("gtm")) {
          const snakeKey = key
            .replace("gtm", "")
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/^_/, "");

          attributes[snakeKey] = dataset[key];
        }
      });

      return attributes;
    },
    []
  );

  const trackButtonClick = useCallback(
    (element: Element) => {
      const attributes = extractAttributes(element);
      tracker.click({
        click_type:
          attributes.click_type || "button_click",
        click_text: attributes.element_text || "button_click",
        click_source: attributes.source || "unknown"
      });
    },
    [extractAttributes]
  );

  const trackSectionView = useCallback(
    (element: Element) => {
      const viewedSections = viewedSectionsRef.current;

      if (viewedSections.has(element)) {
        return;
      }

      viewedSections.add(element);
      const attributes = extractAttributes(element);

      tracker.sectionView({
        click_type: attributes.label || attributes.element_id || "section_view",
        section_name: attributes.section_name || "section_view",
      });
    },
    [extractAttributes]
  );

  const categorizeElements = useCallback(() => {
    const trackableElements = document.querySelectorAll(".gtm-track-element");
    const buttons: Element[] = [];
    const sections: Element[] = [];

    trackableElements.forEach((element) => {
      const category = (element as HTMLElement).dataset.gtmCategory;

      if (category === "button") {
        buttons.push(element);
      } else if (category === "section") {
        sections.push(element);
      }
    });

    return { buttons, sections };
  }, []);

  const setupButtonTracking = useCallback(() => {
      const clickHandler = (event: Event) => {
        const target = event.target as HTMLElement;

        if (target.classList.contains('gtm-track-element') 
          && target.dataset.gtmCategory === 'button') {
          trackButtonClick(target);
        }
      };

      document.addEventListener("click", clickHandler);

      return clickHandler;
    },
    [trackButtonClick]
  );

  const setupSectionTracking = useCallback(
    (sections: Element[]) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              trackSectionView(entry.target);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px",
        }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });

      return observer;
    },
    [trackSectionView]
  );

  useEffect(() => {
    const viewedSections = viewedSectionsRef.current;
    const { sections } = categorizeElements();

    const clickHandler = setupButtonTracking();
    const observer = setupSectionTracking(sections);

    return () => {
      document.removeEventListener("click", clickHandler);
      observer.disconnect();
      viewedSections.clear();
    };
  }, [categorizeElements, setupButtonTracking, setupSectionTracking]);
};
