'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Required'),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const supabase = createClient();

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 overflow-hidden bg-gray-50 md:grid-cols-2 dark:bg-gray-950">
      {/* Left side: Retail shop interior side image */}
      <div className="relative hidden h-full min-h-[500px] w-full md:block">
        <Image
          src="/images/side-image.png"
          alt="Medebr Shop Interior"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>

      {/* Right side: Reset password form and brand branding */}
      <div className="flex h-full w-full flex-col items-center justify-center space-y-6 p-8 md:p-12 lg:p-16">
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
          <h2 className="text-2xl font-extrabold tracking-tight text-[#7e0f2b] dark:text-[#ea5b82]">
            Medebr Shop
          </h2>
        </div>

        {/* White container Card */}
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8 dark:border-gray-700 dark:bg-gray-800">
          {success ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                  Password Updated
                </h1>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Your password has been successfully updated! You will now be redirected to the
                  homepage in a few seconds.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full rounded-xl bg-[#7e0f2b] py-3 text-base font-semibold text-white transition-all hover:bg-[#610b20]"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                  Choose New Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set a secure password for your Medebr Shop account
                </p>
              </div>

              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={ResetPasswordSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setServerError(null);
                  try {
                    const { error } = await supabase.auth.updateUser({
                      password: values.password,
                    });

                    if (error) {
                      setServerError(error.message);
                      setSubmitting(false);
                    } else {
                      setSuccess(true);
                      toast.success('Password updated successfully!');
                      setTimeout(() => {
                        router.push('/');
                        router.refresh();
                      }, 3000);
                    }
                  } catch {
                    setServerError('An unexpected error occurred. Please try again.');
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    {/* New Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        New Password
                      </label>
                      <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="block w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pr-10 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="block w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pr-10 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    {serverError && (
                      <p className="text-center text-sm font-semibold text-red-500">
                        {serverError}
                      </p>
                    )}

                    <div>
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full rounded-xl bg-[#7e0f2b] py-3 text-base font-semibold text-white transition-all hover:bg-[#610b20] active:scale-[0.98]"
                      >
                        Update Password
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
