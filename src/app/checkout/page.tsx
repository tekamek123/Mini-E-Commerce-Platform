'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  Truck,
  Lock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

const CheckoutSchema = Yup.object().shape({
  fullName: Yup.string().min(3, 'Name is too short').required('Required'),
  address: Yup.string().min(10, 'Address is too short').required('Required'),
  city: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required'),
  phone: Yup.string()
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number')
    .required('Required'),
});

type CheckoutFormValues = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null); // Stores created order ID

  const { items, getTotalPrice, clearCart } = useCartStore();
  const supabase = createClient();

  // Prevent hydration mismatch and handle callback parameters
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);

      // Parse success/error params from the hosted checkout redirect safely in useEffect
      const searchParams = new URLSearchParams(window.location.search);
      const success = searchParams.get('success');
      const orderId = searchParams.get('order_id');
      const error = searchParams.get('error');

      if (success === 'true' && orderId) {
        setOrderSuccess(orderId);
        clearCart();
        // Clean URL to make the page shareable without triggering cart clear loops
        window.history.replaceState({}, '', '/checkout');
      } else if (success === 'false' && error) {
        toast.error(error);
        window.history.replaceState({}, '', '/checkout');
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [clearCart]);

  if (!mounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If cart is empty and order is not successful yet, show empty cart notice
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 py-20 text-center shadow-sm dark:bg-gray-800">
        <div className="mb-6 rounded-full bg-indigo-50 p-6 dark:bg-indigo-900/20">
          <ShoppingBag className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Nothing to checkout
        </h2>
        <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">
          Your cart is currently empty. You must add items to your cart before proceeding to
          checkout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Shop
        </Link>
      </div>
    );
  }

  // If order is successful, display a gorgeous confirmation card
  if (orderSuccess) {
    // Generate an estimated delivery date (4 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <div className="mx-auto max-w-2xl space-y-8 py-10 text-center">
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-6 dark:bg-green-900/20">
            <CheckCircle className="animate-scale-in h-20 w-20 text-green-500 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your order has been placed successfully and is being processed.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-6 text-left dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</span>
              <span className="pl-4 font-mono text-sm font-semibold break-all text-gray-900 dark:text-white">
                {orderSuccess}
              </span>
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <Calendar className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Estimated Delivery
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formattedDeliveryDate}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <Truck className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Delivery Method
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Standard Home Delivery (Free)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    try {
      // To satisfy unused-vars linter, print recipient name in dev console
      console.log('Processing order for:', values.fullName);

      // 1. Fetch current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You must be signed in to place an order.');
        router.push('/login?next=/checkout');
        return;
      }

      // 2. Fetch all products from Supabase to match front-end fakeStore API titles to DB UUIDs
      const { data: dbProducts, error: dbProductsError } = await supabase
        .from('products')
        .select('id, title');

      if (dbProductsError) {
        throw new Error('Failed to resolve product catalog.');
      }

      // 3. Insert order record into Supabase orders table
      const orderTotal = getTotalPrice();
      const { data: orderData, error: orderInsertError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderInsertError || !orderData) {
        throw new Error(orderInsertError?.message || 'Failed to create order record.');
      }

      // 4. Map cart items to the database products via titles and construct order items payload
      const orderItemsPayload = items.map((cartItem) => {
        const matchedDbProduct = dbProducts?.find(
          (dbProd) => dbProd.title.toLowerCase() === cartItem.title.toLowerCase(),
        );

        return {
          order_id: orderData.id,
          product_id: matchedDbProduct?.id || null, // Will match to UUID if found
          quantity: cartItem.quantity,
          price_at_time: cartItem.price,
        };
      });

      // 5. Insert order items into Supabase
      const { error: itemsInsertError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsInsertError) {
        throw new Error(itemsInsertError.message || 'Failed to add products to order.');
      }

      // 6. Initialize StarPay Gateway session via API Route
      const initResponse = await fetch('/api/payment/starpay/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: orderTotal,
          customer: {
            name: values.fullName,
            email: user.email || 'guest@example.com',
            phone: values.phone,
          },
        }),
      });

      const initData = await initResponse.json();
      if (!initResponse.ok || !initData.success) {
        throw new Error(initData.error || 'Failed to initialize StarPay session.');
      }

      toast.success('Redirecting to StarPay Secure Checkout...');

      // Redirect browser directly to StarPay's hosted secure checkout screen
      router.push(initData.checkout_url);
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while placing your order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Complete your delivery details below to finalize your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Delivery Details Form */}
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 dark:border-gray-700">
            <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
              <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <Formik
            initialValues={{
              fullName: '',
              address: '',
              city: '',
              postalCode: '',
              phone: '',
            }}
            validationSchema={CheckoutSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <Field
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                    placeholder="Tekalegn Mekonen"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Address
                  </label>
                  <Field
                    id="address"
                    name="address"
                    type="text"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                    placeholder="Ras Mekonen St"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      City
                    </label>
                    <Field
                      id="city"
                      name="city"
                      type="text"
                      className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                      placeholder="Addis Ababa"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Postal Code
                    </label>
                    <Field
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                      placeholder="1000"
                    />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:text-white"
                    placeholder="+251912345678"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Secure SSL connection. Your details are fully encrypted.</span>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center rounded-xl py-3 text-base font-semibold"
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Order'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Order Review Column */}
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 dark:border-gray-700">
            <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-900/30">
              <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Review</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review your products before placing the order
              </p>
            </div>
          </div>

          {/* Cart items list */}
          <div className="max-h-[300px] space-y-4 divide-y divide-gray-100 overflow-y-auto pr-1 dark:divide-gray-700">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center space-x-4 ${index > 0 ? 'pt-4' : ''}`}
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white dark:border-gray-700">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quantity: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span className="font-medium text-green-600 dark:text-green-400">Free</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
