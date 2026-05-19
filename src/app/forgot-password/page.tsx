'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
});

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

      {/* Right side: Forgot password form and brand branding */}
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
          {successMessage ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                  Check Your Email
                </h1>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {successMessage}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-semibold text-[#7e0f2b] transition-colors hover:text-[#610b20] dark:text-[#ea5b82]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email to receive a password reset link
                </p>
              </div>

              <Formik
                initialValues={{ email: '' }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setServerError(null);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
                      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
                    });

                    if (error) {
                      setServerError(error.message);
                      setSubmitting(false);
                    } else {
                      setSuccessMessage(
                        `We have sent a secure password reset link to your email address: ${values.email}. Please open the link in the email to set a new password.`,
                      );
                    }
                  } catch {
                    setServerError('An unexpected error occurred. Please try again later.');
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    {/* Email address field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Email address
                      </label>
                      <div className="relative mt-1.5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                          placeholder="tekamek25@gmail.com"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
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
                        Send Reset Link
                      </Button>
                    </div>

                    <div className="pt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                      <Link
                        href="/login"
                        className="inline-flex items-center font-semibold text-[#7e0f2b] transition-colors hover:text-[#610b20] dark:text-[#ea5b82]"
                      >
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Login
                      </Link>
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
