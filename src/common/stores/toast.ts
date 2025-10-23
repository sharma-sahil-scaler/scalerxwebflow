import { atom } from "nanostores";

export type ToastVariant = "default" | "success" | "warning" | "destructive" | "info";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export const $toasts = atom<Toast[]>([]);

let idCounter = 0;
function nextId(): string {
  return `${Date.now()}-${idCounter++}`;
}

export function showToast(input: Omit<Toast, "id">): string {
  const id = nextId();
  const toast: Toast = { id, duration: 3500, variant: "default", ...input };
  const current = $toasts.get();
  $toasts.set([...current, toast]);
  if (toast.duration && toast.duration > 0) {
    window.setTimeout(() => dismissToast(id), toast.duration);
  }
  return id;
}

export function dismissToast(id: string): void {
  const current = $toasts.get();
  $toasts.set(current.filter((t) => t.id !== id));
}

export function clearToasts(): void {
  $toasts.set([]);
}

export const toast = {
  show: showToast,
  dismiss: dismissToast,
  clear: clearToasts,
};


