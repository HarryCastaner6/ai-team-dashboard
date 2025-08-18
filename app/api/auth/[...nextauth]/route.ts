import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Mock users for deployment (no database required)
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN'
  },
  {
    id: '2', 
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User',
    role: 'ADMIN'
  },
  {
    id: '3',
    email: 'john@example.com', 
    password: 'password123',
    name: 'John Doe',
    role: 'ADMIN'
  },
  {
    id: '4',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User', 
    role: 'USER'
  }
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in mock data
        const user = mockUsers.find(u => u.email === credentials.email)

        if (!user) {
          return null
        }

        // Simple password check (in production, use proper hashing)
        if (credentials.password !== user.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }