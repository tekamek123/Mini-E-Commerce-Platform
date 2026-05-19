import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/login/actions';
import { ShoppingCart, User } from 'lucide-react';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              MiniShop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden text-sm text-gray-700 sm:block dark:text-gray-300">
                  {user.email}
                </span>
                <form action={signout}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <User className="mr-1 h-5 w-5" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
