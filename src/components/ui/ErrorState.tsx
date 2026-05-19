import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while fetching the data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mx-auto my-8 flex max-w-md flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-center dark:border-red-900/20 dark:bg-red-900/10">
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center rounded-xl bg-[#7e0f2b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#610b20] focus:outline-none active:scale-95 dark:bg-[#ea5b82] dark:hover:bg-[#d63f68]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
