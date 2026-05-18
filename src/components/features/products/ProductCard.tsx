import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="aspect-[4/3] bg-white dark:bg-gray-800 sm:aspect-[4/3] sm:h-auto w-full overflow-hidden relative border-b border-gray-100 dark:border-gray-700 block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <Link href={`/products/${product.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2" title={product.title}>
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </p>
          <div className="mt-2 flex items-center space-x-1">
             <span className="text-yellow-400 text-sm">★ {product.rating.rate}</span>
             <span className="text-gray-500 text-xs">({product.rating.count})</span>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
          Add to cart
        </button>
      </div>
    </div>
  );
}
