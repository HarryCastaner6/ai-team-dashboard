import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  try {
    // Temporary bypass for testing - remove after fixing auth
    const bypassAuth = request.nextUrl.searchParams.get('bypass') === 'true'
    
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/register')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    
    // Skip middleware for auth API routes
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // Try multiple ways to get the token
    let token = null
    try {
      token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'ai-team-dashboard-secret-2024-production-nextauth-jwt-signing-key-secure',
        cookieName: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
      })
    } catch (tokenError) {
      console.log('Token error:', tokenError)
      // Try alternative cookie name
      try {
        token = await getToken({ 
          req: request,
          secret: process.env.NEXTAUTH_SECRET || 'ai-team-dashboard-secret-2024-production-nextauth-jwt-signing-key-secure',
          cookieName: 'next-auth.session-token'
        })
      } catch (altError) {
        console.log('Alternative token error:', altError)
      }
    }
    
    console.log('Middleware - Path:', request.nextUrl.pathname, 'Token:', !!token, 'isDashboard:', isDashboard, 'Bypass:', bypassAuth)
    console.log('Cookies:', request.cookies.getAll().map(c => c.name))

    // For now, disable middleware redirects to prevent redirect loops
    // Just allow access and let the frontend handle auth
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