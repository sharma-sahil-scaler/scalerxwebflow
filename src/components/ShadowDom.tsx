import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowDomProps {
  children: React.ReactNode;
  mode?: "open" | "closed";
}

/**
 * ShadowDom component that renders children inside a Shadow DOM
 * This isolates styles and DOM structure from the parent document
 */
export function ShadowDom({ children, mode = "open" }: ShadowDomProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      // Check if shadow root already exists (e.g., from HMR)
      let shadow = hostRef.current.shadowRoot as ShadowRoot;
      
      if (!shadow) {
        // Attach shadow root only if it doesn't exist
        shadow = hostRef.current.attachShadow({ mode });
        
        // Create a container for React content
        const container = document.createElement("div");
        shadow.appendChild(container);
        
        // Copy styles into shadow DOM
        // Clone all stylesheets from the document
        const styles = Array.from(document.styleSheets);
        styles.forEach((styleSheet) => {
          try {
            if (styleSheet.href) {
              // External stylesheet
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = styleSheet.href;
              shadow.appendChild(link);
            } else if (styleSheet.ownerNode) {
              // Inline stylesheet
              const style = styleSheet.ownerNode.cloneNode(true);
              shadow.appendChild(style);
            }
          } catch (e) {
            // CORS or other issues - skip this stylesheet
            console.warn("Could not clone stylesheet:", e);
          }
        });
      }

      setShadowRoot(shadow);
    }
  }, [mode, shadowRoot]);

  return (
    <div ref={hostRef}>
      {shadowRoot && createPortal(children, shadowRoot.querySelector("div")!)}
    </div>
  );
}

