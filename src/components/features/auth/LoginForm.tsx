'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
});

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Left side: Retail shop interior side image */}
      <div className="relative hidden md:block w-full h-full min-h-[500px]">
        <Image
          src="/images/side-image.png"
          alt="Medebr Shop Interior"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>

      {/* Right side: Login form and brand branding */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 space-y-6 w-full h-full">
        {/* Medebr Shop Logo and Name Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/images/logo.png"
            alt="Medebr Shop Logo"
            width={120}
            height={90}
            priority
            className="object-contain"
          />
          <h2 className="text-2xl font-extrabold text-[#7e0f2b] dark:text-[#ea5b82] tracking-tight">
            Medebr Shop
          </h2>
        </div>

        {/* White container Card */}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to access your curated shop
            </p>
          </div>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setServerError(null);
              const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
              });

              if (error) {
                setServerError(error.message);
                setSubmitting(false);
              } else {
                router.push('/');
                router.refresh();
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div className="space-y-4">
                  {/* Email address field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Email address
                    </label>
                    <div className="relative mt-1.5">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus:outline-none transition-all"
                        placeholder="tekamek25@gmail.com"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-[#7e0f2b] hover:text-[#610b20] dark:text-[#ea5b82] transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative mt-1.5">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus:outline-none transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#7e0f2b] focus:ring-[#7e0f2b] focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>

                {serverError && (
                  <p className="text-center text-sm font-semibold text-red-500">{serverError}</p>
                )}

                <div>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full py-3 bg-[#7e0f2b] hover:bg-[#610b20] text-white font-semibold rounded-xl text-base transition-all active:scale-[0.98]"
                  >
                    Sign In
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-[#7e0f2b] hover:text-[#610b20] dark:text-[#ea5b82] transition-colors"
                  >
                    Register here
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
