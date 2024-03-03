"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = require("fs");
const sharp_1 = __importDefault(require("sharp"));
const uploadImage = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = ctx.state;
    const s3 = new aws_sdk_1.default.S3({
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: 'ap-northeast-2',
    });
    const { files } = ctx.request;
    try {
        if (!files)
            return;
        const photo = Array.isArray(files) ? files[0].file : files.file;
        const { filepath, originalFilename, mimetype, size } = photo;
        const body = (0, fs_1.createReadStream)(filepath);
        const sharpImage = (0, sharp_1.default)(filepath);
        const metadata = yield sharpImage.metadata();
        const { width, height } = metadata;
        const thumbnail = yield sharpImage
            .resize({ width: 200 })
            .rotate(90)
            .toBuffer();
        const date = new Date();
        const now = date.getTime();
        const s3Params = {
            Bucket: `${process.env.BUCKET_NAME}/files`,
            Key: `original/${now}${originalFilename}`,
            Body: body,
            ContentType: `${mimetype}`,
        };
        const s3ThumbnailParams = {
            Bucket: `${process.env.BUCKET_NAME}/files`,
            Key: `thumbnail/${now}${originalFilename}`,
            Body: thumbnail,
            ContentType: `${mimetype}`,
        };
        if (size > 1024 * 1024 * 5) {
            throw new Error('5MB 이하 이미지만 업로드 가능합니다.');
        }
        const data = yield s3.upload(s3Params).promise();
        const thumbnailData = yield s3.upload(s3ThumbnailParams).promise();
        const photos = user.photos;
        photos.push({
            createdDate: date.toISOString(),
            url: data.Location,
            thumbnail: thumbnailData.Location,
            width: height !== null && height !== void 0 ? height : 0,
            height: width !== null && width !== void 0 ? width : 0,
        });
        user.save();
        ctx.body = data;
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.uploadImage = uploadImage;
