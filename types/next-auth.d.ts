import { UserRole, UserSegment } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: UserRole;
      segment?: UserSegment;
      title?: string | null;
      department?: string | null;
    };
  }

  interface User {
    role?: UserRole;
    segment?: UserSegment;
    title?: string | null;
    department?: string | null;
  }
}
