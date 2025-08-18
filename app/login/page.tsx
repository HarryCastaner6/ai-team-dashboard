'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Login successful!')
        // Add a small delay to ensure the session is properly set
        setTimeout(() => {
          router.push('/dashboard')
          // Force page reload if needed
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard'
          }
        }, 500)
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 200, 87, 0.3) 0%, transparent 50%)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '450px',
        margin: '0',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        animation: 'slideInDown 0.8s ease-out'
      }}>
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '32px' }}>
          <div style={{ 
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
            borderRadius: '20px',
            padding: '20px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)'
          }}>
            <span style={{ fontSize: '32px' }}>⚡</span>
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '12px'
          }}>Welcome Back</h2>
          <p style={{ 
            opacity: 0.9, 
            fontSize: '1.1rem', 
            marginTop: '5px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '300'
          }}>
            Sign in to your AI-powered productivity suite ✨
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ animation: 'slideInLeft 0.8s ease-out 0.2s both' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '12px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Email
              </label>
              <input
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>

            <div style={{ animation: 'slideInRight 0.8s ease-out 0.4s both' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '12px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Password
              </label>
              <input
                type="password"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginTop: '16px',
                background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)',
                animation: 'slideInUp 0.8s ease-out 0.6s both',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 107, 107, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 107, 107, 0.3)'
                }
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="loading-placeholder" style={{ padding: '0', margin: '0 10px 0 0' }}>
                    <i style={{ fontSize: '1rem', margin: 0, animation: 'spin 1s linear infinite' }}>⟳</i>
                  </div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ 
            marginTop: '32px', 
            textAlign: 'center',
            animation: 'fadeInUp 0.8s ease-out 0.8s both'
          }}>
            <p style={{ 
              opacity: 0.9,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem'
            }}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                style={{ 
                  color: '#ffffff', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}