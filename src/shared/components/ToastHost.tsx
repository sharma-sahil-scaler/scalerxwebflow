import { useStore } from "@nanostores/react";
import { $toasts, dismissToast, type Toast } from "@/shared/stores/toast";
import { cn } from "@/lib/utils";

function ToastItem({ toast }: { toast: Toast }) {
  const { id, title, description, variant } = toast;
  const base =
    "pointer-events-auto relative w-full overflow-hidden rounded-md border shadow-lg bg-background text-foreground";
  const spacing = "p-3 sm:p-4";
  const layout = "flex flex-col gap-1";
  const variants: Record<NonNullable<Toast["variant"]>, string> = {
    default: "",
    success: "border-green-600 bg-green-50 text-green-900",
    warning: "border-yellow-600 bg-yellow-50 text-yellow-900",
    destructive: "border-red-600 bg-red-50 text-red-900",
    info: "border-blue-600 bg-blue-50 text-blue-900",
  };

  return (
    <div
      className={cn(
        base,
        spacing,
        layout,
        variant ? variants[variant] : undefined
      )}
      role="status"
      aria-live="polite"
    >
      {title ? <div className="text-sm font-medium">{title}</div> : null}
      {description ? (
        <div className="text-muted-foreground text-sm">{description}</div>
      ) : null}
      <button
        className="absolute right-2 top-2 rounded-xs p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden"
        aria-label="Close"
        onClick={() => dismissToast(id)}
      >
        ×
      </button>
    </div>
  );
}

export default function ToastHost() {
  const toasts = useStore($toasts);
  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-4 sm:top-4 sm:right-4">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
