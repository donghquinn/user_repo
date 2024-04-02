import { globalConfig } from '@configs/ServerConfig';
import { createCipheriv, createDecipheriv, createHash } from 'node:crypto';

export const encryptString = (rawString: string) => {
  const cipher = createCipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
  const encodedString = cipher.update(rawString, 'utf8', 'base64') + cipher.final('base64');

  return encodedString;
};

export const encryptPassword = (rawPassword: string) => createHash('sha256').update(rawPassword).digest('base64');

export const decryptString = (encodedString: string) => {
  const decipher = createDecipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
  const decodedString = decipher.update(encodedString, 'base64', 'utf8') + decipher.final('utf8');

  return decodedString;
};
