"use client";

import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page pt-16">
      <ErrorState
        title="Something went wrong"
        description="We hit an unexpected problem loading this page. Trying again usually fixes it."
        action={
          <Button type="button" onClick={reset}>
            Try Again
          </Button>
        }
      />
    </div>
  );
}
