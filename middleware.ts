import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'ai-team-dashboard-secret-2024-production-nextauth-jwt-signing-key-secure'
    })
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/register')
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

    if (isDashboard && !token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && token) {
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