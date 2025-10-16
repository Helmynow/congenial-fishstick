import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/db';
import { UserRole, UserSegment } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    ...(process.env.EMAIL_SERVER
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM || 'noreply@ese-school.edu.eg',
            // Development console logging for magic links
            ...(process.env.NODE_ENV === 'development' && {
              sendVerificationRequest({ identifier, url }) {
                console.log('\n🔐 MAGIC LINK AUTHENTICATION 🔐');
                console.log(`📧 Email: ${identifier}`);
                console.log(`🔗 URL: ${url}`);
                console.log('\nℹ️ Copy and paste the URL into your browser to sign in\n');
              },
            }),
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            segment: true,
            title: true,
            department: true,
          },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.segment = dbUser.segment;
          token.title = dbUser.title;
          token.department = dbUser.department;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as UserRole,
          segment: token.segment as UserSegment,
          title: token.title as string | null,
          department: token.department as string | null,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  events: {
    async signIn({ user }) {
      await prisma.activityLog.create({
        data: {
          actorId: user.id,
          action: 'USER_LOGIN',
          meta: { 
            method: 'signin',
            timestamp: new Date().toISOString() 
          },
        },
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
