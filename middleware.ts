import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  try {
    // Temporary bypass for testing - remove after fixing auth
    const bypassAuth = request.nextUrl.searchParams.get('bypass') === 'true'
    
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'ai-team-dashboard-secret-2024-production-nextauth-jwt-signing-key-secure'
    })
    
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/register')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    
    console.log('Middleware - Path:', request.nextUrl.pathname, 'Token:', !!token, 'isDashboard:', isDashboard, 'Bypass:', bypassAuth)

    // If accessing dashboard without token (and no bypass), redirect to login
    if (isDashboard && !token && !bypassAuth) {
      console.log('Redirecting to login - no token')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If accessing auth pages with token, redirect to dashboard
    if (isAuthPage && token) {
      console.log('Redirecting to dashboard - has token')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Allow access if there's an error to prevent blocking the app
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}