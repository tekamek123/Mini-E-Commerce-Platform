import ProductList from '@/components/features/products/ProductList';

export default function Home() {
  return (
    <div className="space-y-8">
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
