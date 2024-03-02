import { type UserState } from '@middleware';
import AWS from 'aws-sdk';
import { createReadStream } from 'fs';
import type Router from 'koa-router';
import sharp from 'sharp';

export const uploadImage: Router.IMiddleware<UserState> = async (ctx) => {
  const { user } = ctx.state;

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2',
  });

  const { files } = ctx.request;

  try {
    if (!files) return;

    const photo = Array.isArray(files) ? files[0].file : files.file;

    const { filepath, originalFilename, mimetype, size } = photo;

    const body = createReadStream(filepath);

    const sharpImage = sharp(filepath);
    const metadata = await sharpImage.metadata();
    const { width, height } = metadata;

    const thumbnail = await sharpImage
      .resize({ width: 200 })
      .rotate(90)
      .toBuffer();

    const date = new Date();
    const now = date.getTime();
    const s3Params: AWS.S3.PutObjectRequest = {
      Bucket: `${process.env.BUCKET_NAME}/files`,
      Key: `original/${now}${originalFilename}`,
      Body: body,
      ContentType: `${mimetype}`,
    };

    const s3ThumbnailParams: AWS.S3.PutObjectRequest = {
      Bucket: `${process.env.BUCKET_NAME}/files`,
      Key: `thumbnail/${now}${originalFilename}`,
      Body: thumbnail,
      ContentType: `${mimetype}`,
    };

    if (size > 1024 * 1024 * 5) {
      throw new Error('5MB 이하 이미지만 업로드 가능합니다.');
    }

    const data = await s3.upload(s3Params).promise();
    const thumbnailData = await s3.upload(s3ThumbnailParams).promise();

    const photos = user.photos;

    photos.push({
      createdDate: date.toISOString(),
      url: data.Location,
      thumbnail: thumbnailData.Location,
      width: height ?? 0,
      height: width ?? 0,
    });
    user.save();

    ctx.body = data;
  } catch (error: any) {
    ctx.throw(500, error);
  }
};
