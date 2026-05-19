import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('payment_token');

    if (!token) {
      return new NextResponse('<h1>Error: Missing payment token</h1>', {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Decode base64 payload to retrieve transaction details
    const jsonString = Buffer.from(token, 'base64').toString('utf-8');
    const paymentData = JSON.parse(jsonString);

    const {
      order_reference: orderRef,
      amount,
      currency = 'USD',
      customer,
      callback_url: callbackUrl,
      return_url: returnUrl,
    } = paymentData;

    // Render a stunning, high-fidelity payment interface mimicking StarPay Secure Checkout
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StarPay Secure Checkout Sandbox</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Outfit', sans-serif;
          }
        </style>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center space-x-2">
              <div class="bg-gradient-to-tr from-amber-400 to-rose-500 p-2 rounded-xl text-slate-950 font-extrabold text-xl shadow-md">
                ★
              </div>
              <div>
                <span class="block font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 to-rose-400 bg-clip-text text-transparent">StarPay</span>
                <span class="block text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Secure Gateway</span>
              </div>
            </div>
            <div class="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Sandbox Test
            </div>
          </div>

          <!-- Invoice summary -->
          <div class="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400">Order ID:</span>
              <span class="font-mono text-xs font-bold text-slate-200">${orderRef}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400">Customer:</span>
              <span class="text-slate-200 font-medium">${customer.name}</span>
            </div>
            <div class="flex justify-between items-center border-t border-slate-800/80 pt-3">
              <span class="text-slate-400 font-semibold">Total Amount:</span>
              <span class="text-2xl font-extrabold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                ${currency === 'USD' ? '$' : ''}${amount.toFixed(2)} ${currency !== 'USD' ? currency : ''}
              </span>
            </div>
          </div>

          <!-- Card Form Mock -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
              <input type="text" value="${customer.name}" class="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors" readonly>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Card Number</label>
              <div class="relative">
                <input type="text" value="••••  ••••  ••••  4321" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300" readonly>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  VISA
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                <input type="text" value="12 / 29" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300 text-center" readonly>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">CVV</label>
                <input type="text" value="***" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300 text-center" readonly>
              </div>
            </div>
          </div>

          <!-- Simulator Controls -->
          <div class="space-y-3 pt-2">
            <button id="paySuccess" class="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-[0.99] text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2">
              <span id="btnText">Approve & Pay Successfully</span>
              <svg id="loadingSpinner" class="hidden animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
            <button id="payFail" class="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 font-medium py-3 rounded-xl transition-colors active:scale-[0.99]">
              Simulate Declined / Cancelled Card
            </button>
          </div>

          <!-- Bottom Security Info -->
          <div class="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
            <svg class="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>Fully encrypted TLS-secure mock environment</span>
          </div>
        </div>

        <script>
          const paySuccessBtn = document.getElementById('paySuccess');
          const payFailBtn = document.getElementById('payFail');
          const btnText = document.getElementById('btnText');
          const spinner = document.getElementById('loadingSpinner');

          paySuccessBtn.addEventListener('click', async () => {
            // Display loading feedback
            paySuccessBtn.disabled = true;
            payFailBtn.disabled = true;
            btnText.textContent = 'Processing Payment...';
            spinner.classList.remove('hidden');

            try {
              // 1. Fire Webhook Callback (Updates Order state in database via callback route)
              const res = await fetch('${callbackUrl}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_reference: '${orderRef}',
                  status: 'success',
                  payment_ref: 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase()
                })
              });

              if (!res.ok) {
                throw new Error('Callback failed');
              }

              // 2. Redirect back to Return URL upon webhook success
              window.location.href = '${returnUrl}';
            } catch (err) {
              console.error(err);
              alert('Sandbox Simulation Error: Webhook callback connection failed. Redirecting back to store.');
              window.location.href = '${returnUrl}';
            }
          });

          payFailBtn.addEventListener('click', () => {
            // Redirect back to return URL with decline query params
            const failureUrl = '${returnUrl}'.replace('success=true', 'success=false').concat('&error=Payment+Declined+by+StarPay+Sandbox');
            window.location.href = failureUrl;
          });
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: unknown) {
    console.error('[StarPay Sandbox] Load Error:', error);
    return new NextResponse('<h1>Internal Server Error loading StarPay Sandbox</h1>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
