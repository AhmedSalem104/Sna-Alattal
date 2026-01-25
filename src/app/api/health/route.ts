import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Returns the health status of the application
 */
export async function GET() {
  const startTime = Date.now();

  const health = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks: {
      database: { status: 'unknown' as string, latency: 0 },
      memory: { status: 'unknown' as string, used: 0, total: 0 },
    },
  };

  // Check database connection
  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    health.checks.database = {
      status: 'healthy',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    health.checks.database = {
      status: 'unhealthy',
      latency: -1,
    };
    health.status = 'degraded';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const memoryPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  health.checks.memory = {
    status: memoryPercent > 90 ? 'warning' : 'healthy',
    used: usedMB,
    total: totalMB,
  };

  if (memoryPercent > 95) {
    health.status = 'degraded';
  }

  // Calculate total response time
  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    ...health,
    responseTime,
  }, {
    status: health.status === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Simple Ping Endpoint
 * HEAD /api/health
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
