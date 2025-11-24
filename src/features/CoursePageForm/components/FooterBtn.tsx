import { Loader2 } from "lucide-react";

import { Button } from "@/common/components/ui/button";

import { Flex } from "@/common/components/layout/flex";
import { Separator } from "@/common/components/ui/separator";
import { cn } from "@/lib/utils";

export const FooterBtn = ({
  isDisabled = false,
  showLoaderOnDisabled = true,
  footerText = "🔥 <b>10k+</b> working professionals already enrolled",
  buttonWrapperClass = ''
}: {
  currentStep: string;
  isDisabled?: boolean;
  showLoaderOnDisabled?: boolean;
  footerText?: string;
  buttonWrapperClass?: string;
}) => {
  return (
    <Flex align="center" direction="col" gap="md" justify="end">
      <Separator className="mb-0" />
      <Flex className={cn("w-full px-4 pb-6 sm:px-6", buttonWrapperClass)} align="center" direction="col" gap="sm">
        <Button
          id="form-footer-btn"
          size="lg"
          variant="destructive"
          className="w-full bg-[#C32742] py-4 rounded-none text-xl hover:bg-[#C32742]/90 sm:py-6 cursor-pointer"
          disabled={isDisabled}
          type="submit"
        >
          {showLoaderOnDisabled && isDisabled ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: footerText }}
        />
      </Flex>
    </Flex>
  );
};
