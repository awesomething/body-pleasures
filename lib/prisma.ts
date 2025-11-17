import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query', 'error', 'warn'] })
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} catch (initErr) {
  // Log initialization error so it appears in server logs and avoid breaking imports.
  // Export a proxy that throws a clear error when used.
  // This prevents the whole module import from failing during server start.
  // The real fix should be to ensure environment variables and client generation are correct.
  // eslint-disable-next-line no-console
  console.error('[prisma.ts] Prisma initialization failed:', initErr)

  const handler: ProxyHandler<Record<string, never>> = {
    get () {
      throw new Error('Prisma client is not initialized. See server logs for details: ' + String(initErr))
    },
  }

  prisma = new Proxy({}, handler) as unknown as PrismaClient
}

export { prisma }

