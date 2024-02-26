import { type UserDTO } from '@types';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema<UserDTO>({
  email: String,
  nickname: String,
  password: String,
});

export const User = mongoose.model('User', UserSchema);
