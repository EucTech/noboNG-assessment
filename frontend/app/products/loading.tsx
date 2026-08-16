import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/features/products";

export default function ProductsLoading() {
  return (
    <div className="container-page pt-6">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-80" />
      <div className="mt-6">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
