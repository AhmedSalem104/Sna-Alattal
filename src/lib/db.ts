/**
 * Database client (lazy-loaded).
 *
 * When DATABASE_URL is not set, `db` is a Proxy that throws a clear error
 * on any property access, so public routes that never touch the DB work fine
 * while admin routes get a descriptive failure message.
 */

let _db: any = null;

function getDb() {
  if (_db) return _db;

  if (!process.env.DATABASE_URL) {
    // Return a proxy that throws on any usage – import itself won't crash
    _db = new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === 'then') return undefined; // allow awaiting without error
          throw new Error(
            `Database is not configured (no DATABASE_URL). Attempted to access db.${String(prop)}`
          );
        },
      }
    );
    return _db;
  }

  // Dynamically require prisma so that the import doesn't fail at build time
  // when @prisma/client is not generated or DATABASE_URL is missing.
  const { PrismaClient } = require('@prisma/client');

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  if (globalForPrisma.prisma) {
    _db = globalForPrisma.prisma;
  } else {
    _db = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _db;
    }
  }

  return _db;
}

// Export a proxy so that `db.someModel.find(...)` works transparently
// but the actual PrismaClient is only created on first property access.
export const db: any = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getDb();
      return client[prop];
    },
  }
);
