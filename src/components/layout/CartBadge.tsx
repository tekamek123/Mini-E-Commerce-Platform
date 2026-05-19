'use client';

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Prevent hydration mismatch
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return <ShoppingCart className="h-6 w-6" />;
  }

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {totalItems}
        </span>
      )}
    </div>
  );
}
