'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/services/productService';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Star, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg p-6">
        <p className="font-semibold text-lg">Product not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm">
        {/* Product Image */}
        <div className="aspect-square bg-white dark:bg-gray-700 rounded-xl overflow-hidden relative border border-gray-100 dark:border-gray-600">
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
            <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-300 capitalize">
              {product.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
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

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <button className="w-full flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-[0.98]">
              <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
