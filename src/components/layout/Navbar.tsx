import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/login/actions'
import { ShoppingCart, User } from 'lucide-react'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              MiniShop
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white relative">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
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
                <User className="w-5 h-5 mr-1" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
