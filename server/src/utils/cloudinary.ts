import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { config } from '../config';

if (config.cloudinary.url) {
  cloudinary.config({
    cloudinary_url: config.cloudinary.url,
  });
} else if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

export const isCloudinaryEnabled = (): boolean => {
  return Boolean(
    config.cloudinary.url ||
    (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret)
  );
};

export const uploadToCloudinary = async (
  filePath: string,
  folder = 'shadow_code'
): Promise<UploadApiResponse> => {
  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
  });
};

export { cloudinary };
