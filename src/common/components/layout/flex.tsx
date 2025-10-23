import { cn } from "@/lib/utils";

const gapClassesMap = {
  "2xl": "gap-10",
  lg: "gap-6",
  md: "gap-4",
  none: "gap-0",
  sm: "gap-2",
  xl: "gap-8",
} as const;

type FlexItemProps = React.ComponentProps<"div">

interface FlexProps extends React.ComponentProps<"div"> {
  align?: "baseline" | "center" | "end" | "start" | "stretch";
  className?: string;
  direction?: "col" | "col-reverse" | "row" | "row-reverse";
  gap?: GapValue;
  justify?: "around" | "between" | "center" | "end" | "evenly" | "start";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
}

type FlexSpacerProps = React.ComponentProps<"div">

type GapValue = keyof typeof gapClassesMap;

function Flex({
  align = "start",
  className,
  direction = "row",
  gap = "none",
  justify = "start",
  wrap = "nowrap",
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        `flex-${direction}`,
        `flex-${wrap}`,
        `items-${align}`,
        `justify-${justify}`,
        gapClassesMap[gap],
        className,
      )}
      data-slot="flex"
      {...props}
    />
  );
}

function FlexItem({ ...props }: FlexItemProps) {
  return <div data-slot="flex-item" {...props} />;
}

function FlexSpacer({ className, ...props }: FlexSpacerProps) {
  return (
    <div
      className={cn("flex-1", className)}
      data-slot="flex-spacer"
      {...props}
    />
  );
}

export {
  FlexItemProps,
  FlexProps,
  FlexSpacerProps,
  GapValue,
  Flex,
  FlexItem,
  FlexSpacer,
};
