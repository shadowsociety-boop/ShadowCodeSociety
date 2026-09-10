"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
const fs_1 = __importDefault(require("fs"));
// Ensure upload directory exists
const uploadDir = path_1.default.resolve(config_1.config.storage.path);
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const sanitized = file.originalname
            .replace(ext, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 50);
        cb(null, `${sanitized}_${(0, uuid_1.v4)().slice(0, 8)}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    if (config_1.config.storage.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: config_1.config.storage.maxFileSize,
    },
});
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};
exports.getFileUrl = getFileUrl;
//# sourceMappingURL=upload.js.map