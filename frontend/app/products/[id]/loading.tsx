import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="container-page pt-6">
      <Skeleton className="h-3 w-64" />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-11 w-56" />
        </div>
      </div>
    </div>
  );
}
