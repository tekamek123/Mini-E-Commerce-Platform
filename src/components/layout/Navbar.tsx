import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/login/actions';
import { User } from 'lucide-react';
import CartBadge from './CartBadge';

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
            <Link
              href="/"
              aria-label="Medebr Shop Homepage"
              className="rounded-lg text-xl font-bold text-[#7e0f2b] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 dark:text-[#ea5b82] dark:focus-visible:ring-[#ea5b82]"
            >
              Medebr Shop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative rounded-lg p-2 text-gray-600 transition-colors outline-none hover:text-[#7e0f2b] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:text-[#ea5b82] dark:focus-visible:ring-[#ea5b82]"
            >
              <CartBadge />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden text-sm text-gray-700 sm:block dark:text-gray-300">
                  {user.email}
                </span>
                <form action={signout}>
                  <button
                    type="submit"
                    aria-label="Sign out of your account"
                    className="rounded-lg text-sm font-medium text-red-600 transition-colors outline-none hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in to your account"
                className="flex items-center rounded-lg text-sm font-medium text-gray-700 transition-colors outline-none hover:text-[#7e0f2b] focus-visible:ring-2 focus-visible:ring-[#7e0f2b] focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:text-[#ea5b82] dark:focus-visible:ring-[#ea5b82]"
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
