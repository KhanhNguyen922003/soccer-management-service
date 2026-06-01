/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

// import s3 from '@/config/s3.config';
// import multer from 'multer';
// import multerS3 from 'multer-s3';

// const bucketName = process.env.AWS_BUCKET_NAME!;

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: bucketName,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       const fileName = Date.now().toString() + '-' + file.originalname;
//       cb(null, fileName);
//     },
//   }),
// });

// export default upload;

import multer from 'multer';
import cloudinary from '@/config/cloudinary.config';
import streamifier from 'streamifier';

const memoryStorage = multer.memoryStorage();
const baseUpload = multer({ storage: memoryStorage });

/**
 * Upload nhiều file (mặc định field name là 'files')
 */
export const uploadMultipleImages = (fieldName = 'files', maxCount = 10) => {
  return [
    baseUpload.array(fieldName, maxCount),
    async (req: any, res: any, next: any) => {
      try {
        const files = req.files || [];
        const uploaded = [];
        for (const file of files) {
          const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: process.env.CLOUDINARY_UPLOAD_FOLDER || undefined },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
          uploaded.push({
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
        req.uploadedFiles = uploaded;
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
};

/**
 * Upload 1 file
 */
export const uploadSingleImage = (fieldName = 'file') => {
  return [
    baseUpload.single(fieldName),
    async (req: any, res: any, next: any) => {
      try {
        const file = req.file;
        if (!file) return next();
        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_UPLOAD_FOLDER || undefined },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
        req.uploadedFiles = [
          {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: result.secure_url,
            public_id: result.public_id,
          },
        ];
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
};

/**
 * Upload nhiều field (mỗi field khác nhau)
 */
export const uploadFields = (fields: { name: string; maxCount: number }[]) => {
  const multerFields = fields.map((f) => ({ name: f.name, maxCount: f.maxCount }));
  return [
    baseUpload.fields(multerFields),
    async (req: any, res: any, next: any) => {
      try {
        const allFiles: any[] = [];
        for (const key of Object.keys(req.files || {})) {
          const fileArr = req.files[key] as Express.Multer.File[];
          for (const file of fileArr) {
            const result: any = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: process.env.CLOUDINARY_UPLOAD_FOLDER || undefined },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
            allFiles.push({
              fieldname: key,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
        req.uploadedFiles = allFiles;
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
};

// Trường hợp cần raw multer (ít khi dùng)
export default baseUpload;

