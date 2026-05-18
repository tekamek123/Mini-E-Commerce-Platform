'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

export default function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <p className="font-medium">Failed to load products.</p>
        <p className="text-sm mt-1">Please check your connection and try again.</p>
      </div>
    );
  }

  if (!products?.length) {
    return <div className="text-center py-12 text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
