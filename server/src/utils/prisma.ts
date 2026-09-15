import { PrismaClient } from '@prisma/client';

let dbUrl = process.env.DATABASE_URL || '';

if (dbUrl) {
  // Use port 6543 (transaction pooler) with pgbouncer to prevent EMAXCONNSESSION (max 15 clients limit)
  if (dbUrl.includes(':5432') && dbUrl.includes('supabase.com')) {
    dbUrl = dbUrl.replace(':5432', ':6543');
    if (!dbUrl.includes('pgbouncer=true')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }
  }

  // If local DNS fails on macOS for aws-0-ap-south-1.pooler.supabase.com, fall back to resolved IP
  if (process.env.SUPABASE_POOLER_IP && dbUrl.includes('aws-0-ap-south-1.pooler.supabase.com')) {
    dbUrl = dbUrl.replace('aws-0-ap-south-1.pooler.supabase.com', process.env.SUPABASE_POOLER_IP);
  }

  // Ensure SSL mode
  if (!dbUrl.includes('sslmode=') && dbUrl.includes('supabase.com')) {
    dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'sslmode=require';
  }
}

// Global singleton to prevent multiple instances during hot-reloading or across controllers
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
