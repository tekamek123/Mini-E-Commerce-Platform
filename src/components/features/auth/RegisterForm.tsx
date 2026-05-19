'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Required'),
});

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = createClient();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join us and start shopping</p>
      </div>

      <Formik
        initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError(null);

          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
              data: {
                full_name: values.fullName,
              },
            },
          });

          if (error) {
            setServerError(error.message);
            setSubmitting(false);
          } else {
            // Depending on Supabase settings, this might require email confirmation.
            // For this challenge, we assume auto-confirm is enabled or they sign in automatically.
            router.push('/');
            router.refresh();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <Field
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                  placeholder="Tekalegn Mekonen"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>

            {serverError && <p className="text-center text-sm text-red-500">{serverError}</p>}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in here
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
}
