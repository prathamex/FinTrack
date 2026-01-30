import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Guard against Edge runtime where `process` may be undefined
const hasProcess = typeof process !== 'undefined' && typeof process.env !== 'undefined';
const isClerkEnabled =
  hasProcess && Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

// Export a default middleware function directly. If Clerk is not enabled,
// use a no-op that allows the request to pass through.
const noopMiddleware = (request: NextRequest) => NextResponse.next();

export default isClerkEnabled ? clerkMiddleware() : noopMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};