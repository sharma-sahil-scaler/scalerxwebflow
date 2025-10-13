import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "border-input focus-visible:border-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }


