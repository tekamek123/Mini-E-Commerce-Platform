'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/services/productService';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 lg:gap-12 lg:p-8 dark:bg-gray-800">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-4 h-10 w-1/4" />
              <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <Skeleton className="mt-6 h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
        </button>
        <ErrorState
          title="Product not found"
          message="We couldn't load the details for this product. It may have been removed or does not exist."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 lg:gap-12 lg:p-8 dark:bg-gray-800">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-600 dark:bg-gray-700">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6 lg:p-12"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-800 capitalize dark:bg-indigo-900/30 dark:text-indigo-300">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="ml-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {product.rating.rate}
                </span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.rating.count} reviews
              </span>
            </div>

            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </p>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-gray-700">
            <button className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98]">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
