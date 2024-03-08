import {auth} from "@/services/auth";
import {settings} from "@/setting";

/**
 * An array of routes that are public and do not require authentication.
 * can also be accessed when the user is authenticated.
 * @type {string[]}
 */
const ignoredAuthenticationRoutes: string[] = [
  "/",
  "/auth/verify-email",
];

/**
 * An array of routes that don't need to be authenticated.
 * If the user is already authenticated, they will be redirected to the default login redirect path.
 *
 * @type {string[]}
 */
const onlyUnauthenticatedAccessRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

/**
 * The prefix for API routes.
 * Routes that start with this prefix are handled by Auth.js.
 * @type {string}
 */
const apiAuthPrefix: string = "/api/auth";

const middleware = auth( (req) => {
  console.log(`[${req.auth?.user?.id || 'anonymous'}] ${req.method}: ${req.nextUrl.pathname} - ${JSON.stringify(req)}`);

  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;

  // Determine if the route requires authentication
  if (nextUrl.pathname.startsWith(apiAuthPrefix) || ignoredAuthenticationRoutes.includes(nextUrl.pathname)) {
    // Allow /api/auth routes to be handled by Auth.js
    return;
  }

  if (onlyUnauthenticatedAccessRoutes.includes(nextUrl.pathname)) {
    // If the user is already authenticated, redirect to the default login redirect path
    if (isLoggedIn) {
      return Response.redirect(new URL(settings.route.defaultLoginRedirectUrl, nextUrl));
    }
    return;
  }

  if (isLoggedIn) {
    // If the user is authenticated, allow access to the route
    return;
  }

  // Not authenticated, redirect to the login page
  const callbackUrl = nextUrl.search ? `${nextUrl.pathname}${nextUrl.search}` : nextUrl.pathname;

  return Response.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl));

} );

export default middleware;

// Optional, don't invoke the middleware on some paths
export const config = {

  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!.+\\.[\\w]+$|_next|favicon.ico).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};
