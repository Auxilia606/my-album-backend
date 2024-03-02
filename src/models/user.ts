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
