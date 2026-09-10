export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly clientUrl: string;
    readonly jwt: {
        readonly secret: string;
        readonly refreshSecret: string;
        readonly expiresIn: string;
        readonly refreshExpiresIn: string;
    };
    readonly cookie: {
        readonly httpOnly: true;
        readonly secure: boolean;
        readonly sameSite: "strict" | "lax" | "none";
        readonly maxAge: number;
    };
    readonly storage: {
        readonly type: string;
        readonly path: string;
        readonly bucket: string | undefined;
        readonly region: string | undefined;
        readonly accessKey: string | undefined;
        readonly secretKey: string | undefined;
        readonly maxFileSize: number;
        readonly allowedMimeTypes: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown", "application/zip", "application/x-tar", "application/gzip"];
    };
    readonly rateLimit: {
        readonly general: {
            readonly windowMs: number;
            readonly max: 200;
        };
        readonly auth: {
            readonly windowMs: number;
            readonly max: 10;
        };
        readonly registration: {
            readonly windowMs: number;
            readonly max: 20;
        };
    };
};
//# sourceMappingURL=index.d.ts.map