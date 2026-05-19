import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Create the redirect response first so we can attach session cookies to it
  const response = NextResponse.redirect(`${origin}${next}`);

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }

    // Redirect to login with specific error details from code exchange failure
    return NextResponse.redirect(
      `${origin}/login?error=Could not authenticate user&error_code=${error.code || 'unknown'}&error_description=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid reset link code`);
}
