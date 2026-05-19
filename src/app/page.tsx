import ProductList from '@/components/features/products/ProductList';

// Home Page - Force CSS Recompile
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Latest Products
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Browse our collection of the latest products.
        </p>
      </div>

      <ProductList />
    </div>
  );
}
