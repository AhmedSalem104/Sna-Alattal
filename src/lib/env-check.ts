/**
 * Environment variable validation
 * Runs once at startup to ensure all required env vars are set
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

const RECOMMENDED_VARS = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
] as const;

let checked = false;

export function validateEnv() {
  if (checked) return;
  checked = true;

  const missing: string[] = [];
  const missingRecommended: string[] = [];

  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  for (const varName of RECOMMENDED_VARS) {
    if (!process.env[varName]) {
      missingRecommended.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error(
      `[ENV CHECK] CRITICAL: Missing required environment variables: ${missing.join(', ')}`
    );
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }

  if (missingRecommended.length > 0) {
    console.warn(
      `[ENV CHECK] WARNING: Missing recommended environment variables: ${missingRecommended.join(', ')}`
    );
  }

  // Validate NEXTAUTH_SECRET strength
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret && secret.length < 32 && process.env.NODE_ENV === 'production') {
    console.error('[ENV CHECK] CRITICAL: NEXTAUTH_SECRET is too short. Must be 32+ characters.');
    throw new Error('NEXTAUTH_SECRET is too short for production. Use at least 32 characters.');
  }
}
