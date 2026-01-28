import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

/**
 * Upload file to Cloudinary using stream (memory-efficient)
 * Instead of loading entire file into memory as Base64
 */
async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; resource_type: 'auto' | 'image' | 'video' | 'raw' }
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      reject(new Error('Upload timeout'));
    }, UPLOAD_TIMEOUT);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type,
      },
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('No result from Cloudinary'));
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = checkRateLimit(`upload:${clientIP}`, RATE_LIMITS.upload);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Server-side file size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // File type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer (single copy instead of multiple with Base64)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload using stream (no Base64 conversion = ~33% less memory)
    const result = await uploadToCloudinary(buffer, {
      folder: 'sna-alattal',
      resource_type: 'auto',
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === 'Upload timeout') {
        return NextResponse.json(
          { error: 'Upload timed out. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }

    // Add timeout for delete operation
    const deletePromise = cloudinary.uploader.destroy(publicId);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Delete timeout')), UPLOAD_TIMEOUT)
    );

    await Promise.race([deletePromise, timeoutPromise]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
