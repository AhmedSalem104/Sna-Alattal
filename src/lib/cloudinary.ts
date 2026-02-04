import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: string | Buffer,
  options?: {
    folder?: string;
    transformation?: object[];
    public_id?: string;
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/png;base64,${file.toString('base64')}`,
    {
      folder: options?.folder || 'sna-alattal',
      transformation: options?.transformation,
      public_id: options?.public_id,
      resource_type: 'image',
    }
  );

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function uploadPDF(
  file: string | Buffer,
  options?: {
    folder?: string;
    public_id?: string;
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:application/pdf;base64,${file.toString('base64')}`,
    {
      folder: options?.folder || 'sna-alattal/catalogues',
      public_id: options?.public_id,
      resource_type: 'raw',
    }
  );

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: 0,
    height: 0,
    format: 'pdf',
    bytes: result.bytes,
  };
}

/**
 * Extract Cloudinary public_id from a secure_url.
 * Returns null if the URL is not a Cloudinary URL.
 */
export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Delete multiple images from Cloudinary. Silently ignores non-Cloudinary URLs.
 */
export async function deleteImages(urls: string[]): Promise<void> {
  const publicIds = urls
    .map(extractPublicId)
    .filter((id): id is string => id !== null);

  await Promise.allSettled(
    publicIds.map(id => cloudinary.uploader.destroy(id))
  );
}

export function getImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
}): string {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    crop: options?.crop || 'fill',
    quality: options?.quality || 'auto',
    fetch_format: 'auto',
    secure: true,
  });
}
