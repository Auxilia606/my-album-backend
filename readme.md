# My-Album-Frontend

앨범 저장 및 공유 서비스 백엔드 with Koa Framework

## dependency 설명

koa: 기본 framework

koa-bodyparser: body 값 파싱

koa-router: route 구조

mongoose: MongoDB 조회

nodemon: dev환경에서 수정사항 즉시 반영

ts-node: Typesciprt compile 결과를 node에 전달

dotenv: .env 환경설정파일을 process.env에서 조회

bcrypt: 사용자 비밀번호 암호화하여 DB저장

jsonwebtoken: 사용자 정보를 web token으로 바꿔서 전달

aws-sdk: AWS s3 버킷 오브젝트 관리

sharp: 사용자가 업로드 한 사진의 용량을 줄여서 썸네일 파일로 업로드

## 기본 구조 설명

models, controllers, routes 구조 (middleware)

User model
```
import { type PhotoDTO, type UserDTO } from '@types';
import mongoose, { Schema, type Document, type Types } from 'mongoose';

const PhotoSchema = new Schema<PhotoDTO>({
  createdDate: String,
  height: String,
  url: String,
  thumbnail: String,
  width: String,
});

const UserSchema = new Schema<UserDTO>({
  email: String,
  nickname: String,
  password: String,
  photos: [PhotoSchema],
});

export type UserDocument = Document<unknown, any, UserDTO> &
  UserDTO & {
    _id: Types.ObjectId;
  };

export const User = mongoose.model('User', UserSchema);
```
사용자의 이메일주소, 닉네임, 비밀번호 및 사진 관리

한 Document에 같이 담아서 보관

Controllers - route에서 클라이언트 요청에 따른 동작 정의
```
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
```
이미지 업로드 컨트롤러

request 내부의 file에서 사용자가 업로드한 사진을 받아 S3에 업로드

업로드 성공 이후에 db 업데이트

