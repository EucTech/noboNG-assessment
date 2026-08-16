import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page pt-16">
      <EmptyState
        icon={Compass}
        title="We could not find that page"
        description="The page you are looking for may have been moved, or the link is no longer valid."
        action={
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    </div>
  );
}
