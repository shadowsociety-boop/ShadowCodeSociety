import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import fs from 'fs';
import { isCloudinaryEnabled, cloudinary } from '../utils/cloudinary';

// Ensure upload directory exists for local storage fallback
const uploadDir = path.resolve(config.storage.path);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitized = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    cb(null, `${sanitized}_${uuidv4().slice(0, 8)}${ext}`);
  },
});

/**
 * Hybrid storage: streams directly to Cloudinary if configured,
 * otherwise stores on local disk.
 */
const hybridStorage: multer.StorageEngine = {
  _handleFile: (req, file, cb) => {
    if (isCloudinaryEnabled()) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'shadow_code', resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            console.error('[CLOUDINARY] Upload failed:', error);
            // Fallback to disk storage if Cloudinary fails
            return diskStorage._handleFile(req, file, cb);
          }
          cb(null, {
            filename: result.secure_url,
            path: result.secure_url,
            size: result.bytes,
          } as any);
        }
      );
      file.stream.pipe(uploadStream);
    } else {
      diskStorage._handleFile(req, file, cb);
    }
  },
  _removeFile: (req, file, cb) => {
    if (!isCloudinaryEnabled()) {
      diskStorage._removeFile(req, file, cb);
    } else {
      cb(null);
    }
  },
};

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if ((config.storage.allowedMimeTypes as readonly string[]).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

export const upload = multer({
  storage: hybridStorage,
  fileFilter,
  limits: {
    fileSize: config.storage.maxFileSize,
  },
});

export const getFileUrl = (filename: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `/uploads/${filename}`;
};
