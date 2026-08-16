import { Badge } from "@/components/ui/badge";
import type { ProductAvailability } from "@/types";

import { AVAILABILITY_LABEL, AVAILABILITY_VARIANT } from "../utils/availability";

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: ProductAvailability;
  className?: string;
}) {
  return (
    <Badge variant={AVAILABILITY_VARIANT[availability]} className={className}>
      {AVAILABILITY_LABEL[availability]}
    </Badge>
  );
}
