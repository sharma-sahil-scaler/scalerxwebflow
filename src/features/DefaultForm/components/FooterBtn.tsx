import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Flex } from "@/components/layout/flex";
import { Separator } from "@/components/ui/separator";

export const FooterBtn = ({
  isDisabled = false,
  showLoaderOnDisabled = true,
}: {
  currentStep: string;
  isDisabled?: boolean;
  showLoaderOnDisabled?: boolean;
}) => {
  return (
    <Flex align="center" direction="col" gap="md" justify="end">
      <Separator className="mb-0" />
      <Flex className="w-full" align="center" direction="col" gap="sm">
        <Button
          id="form-footer-btn"
          size="lg"
          variant="destructive"
          className="w-full bg-[#C32742] py-4 text-xl hover:bg-[#C32742]/90 sm:py-6 cursor-pointer"
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
          dangerouslySetInnerHTML={{ __html: "Social Proofing" }}
        />
      </Flex>
    </Flex>
  );
};
