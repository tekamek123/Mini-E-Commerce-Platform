'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import ProductCard from './ProductCard';

export default function ProductList() {
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="mt-2 h-6 w-1/4" />
            <Skeleton className="mt-4 h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        message="Could not retrieve the product catalog. Please verify your connection or try again."
        onRetry={refetch}
      />
    );
  }

  if (!products?.length) {
    return <div className="py-12 text-center text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
