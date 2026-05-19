import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-gray-100 bg-white sm:aspect-[4/3] sm:h-auto dark:border-gray-700 dark:bg-gray-800"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <Link
          href={`/products/${product.id}`}
          className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <h3
            className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 capitalize dark:text-gray-400">{product.category}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </p>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-sm text-yellow-400">★ {product.rating.rate}</span>
            <span className="text-xs text-gray-500">({product.rating.count})</span>
          </div>
        </div>
      </div>
      <div className="mt-auto p-4 pt-0">
        <button className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add to cart
        </button>
      </div>
    </div>
  );
}
