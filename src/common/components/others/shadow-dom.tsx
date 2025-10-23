import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowDomProps {
  children: React.ReactNode;
  mode?: "open" | "closed";
}

export function ShadowDom({ children, mode = "open" }: ShadowDomProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      let shadow = hostRef.current.shadowRoot as ShadowRoot;
      
      if (!shadow) {
        shadow = hostRef.current.attachShadow({ mode });

        const container = document.createElement("div");
        shadow.appendChild(container);
        
        const styles = Array.from(document.styleSheets);
        styles.forEach((styleSheet) => {
          try {
            if (styleSheet.href) {
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = styleSheet.href;
              shadow.appendChild(link);
            } else if (styleSheet.ownerNode) {
              const style = styleSheet.ownerNode.cloneNode(true);
              shadow.appendChild(style);
            }
          } catch (e) {
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

