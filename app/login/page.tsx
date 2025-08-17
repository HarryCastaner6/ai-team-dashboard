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
        router.push('/dashboard')
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
      background: '#1a1a1a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="header-background"></div>
      
      <div className="modal-content" style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        maxWidth: '400px',
        margin: '0'
      }}>
        <div className="modal-header">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div className="avatar" style={{ margin: '0 auto 15px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
            </div>
            <h2>Welcome Back</h2>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '5px' }}>
              Sign in to your productivity suite
            </p>
          </div>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Email
              </label>
              <input
                type="email"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <input
                type="password"
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#404040'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="nav-btn"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                marginTop: '10px',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
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

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ opacity: 0.8 }}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                style={{ 
                  color: '#fbbf24', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}