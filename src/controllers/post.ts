import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const upload = multer({
  storage: multerS3({
    s3: new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: 'ap-northeast-2',
    }),
    bucket: 'auxilia-my-album',
    key(req, file, callback) {
      callback(null, `original/${Date.now()}${file.originalname}`);
    },
  }),
});
