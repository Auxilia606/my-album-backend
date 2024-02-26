import { User } from '@models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);

  return hash;
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const findByUserEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findByUserNickname = async (nickname: string) => {
  return await User.findOne({ nickname });
};

export const generateToken = async (email: string, nickname: string) => {
  const token = jwt.sign(
    {
      email,
      nickname,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return token;
};
