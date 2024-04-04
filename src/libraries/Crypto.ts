import { globalConfig } from '@configs/ServerConfig';
import bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv } from 'node:crypto';

export const encryptString = (rawString: string) => {
  const cipher = createCipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
  const encodedString = cipher.update(rawString, 'utf8', 'base64') + cipher.final('base64');

  return encodedString;
};

export const decryptString = (encodedString: string) => {
  const decipher = createDecipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
  const decodedString = decipher.update(encodedString, 'base64', 'utf8') + decipher.final('utf8');

  return decodedString;
};

export const encryptPassword = (rawPassword: string) => bcrypt.hashSync(rawPassword, 10);

export const comparePassword = async (rawPassword: string, encodedPassword: string) =>
  bcrypt.compare(rawPassword, encodedPassword);
