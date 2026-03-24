import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          // Lazy-import db so that this module can be loaded even without DATABASE_URL
          const { db } = await import('@/lib/db');

          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            throw new Error('User not found');
          }

          if (!user.isActive) {
            throw new Error('Account is disabled');
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Update last login (fire-and-forget, don't block auth)
          db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          }).catch((err: unknown) => {
            console.error('Failed to update lastLogin:', err);
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error: unknown) {
          // Re-throw auth errors (User not found, Invalid password, etc.)
          if (error instanceof Error && (
            error.message === 'User not found' ||
            error.message === 'Account is disabled' ||
            error.message === 'Invalid password'
          )) {
            throw error;
          }
          // DB connection errors
          console.error('Auth error (database may be unavailable):', error);
          throw new Error('Authentication service unavailable');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
