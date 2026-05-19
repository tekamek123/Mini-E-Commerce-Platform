'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  // Prevent hydration mismatch by rendering loaders until mounted
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#7e0f2b] dark:text-[#ea5b82]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 py-20 text-center shadow-sm dark:bg-gray-800">
        <div className="mb-6 rounded-full bg-red-50 p-6 dark:bg-red-950/20">
          <ShoppingBag className="h-16 w-16 text-[#7e0f2b] dark:text-[#ea5b82]" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Your cart is empty
        </h2>
        <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">
          Looks like you haven&apos;t added anything to your cart yet. Head back to the shop to find
          your next purchase!
        </p>
        <Link
          href="/"
          aria-label="Start shopping catalog"
          className="inline-flex items-center justify-center rounded-xl bg-[#7e0f2b] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all outline-none hover:bg-[#610b20] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You have {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="space-y-4 lg:col-span-8">
          <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center space-y-4 p-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6"
              >
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-700">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </div>

                {/* Info & controls */}
                <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.id}`}
                      aria-label={`View details for ${item.title}`}
                      className="line-clamp-1 rounded-md px-1 text-base font-semibold text-gray-900 transition-colors outline-none hover:text-[#7e0f2b] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 dark:text-white dark:hover:text-[#ea5b82]"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                      {item.category}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-l-lg p-2 text-gray-500 transition-colors outline-none hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-[#7e0f2b] dark:hover:text-white"
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        className="px-4 text-sm font-semibold text-gray-900 dark:text-white"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-r-lg p-2 text-gray-500 transition-colors outline-none hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-[#7e0f2b] dark:hover:text-white"
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price and delete button */}
                    <div className="flex items-center space-x-6">
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded p-1 text-gray-400 transition-colors outline-none hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/"
            aria-label="Continue shopping catalog"
            className="inline-flex items-center rounded-md px-1 text-sm font-semibold text-[#7e0f2b] transition-colors outline-none hover:text-[#610b20] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 dark:text-[#ea5b82] dark:hover:text-[#ea5b82]/80"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="font-medium text-green-600 dark:text-green-400">Free</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            aria-label="Proceed to checkout details"
            className="flex w-full items-center justify-center rounded-xl bg-[#7e0f2b] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all outline-none hover:bg-[#610b20] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-[#ea5b82] dark:hover:bg-[#d63f68]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
