import { globalConfig } from '@configs/ServerConfig';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

describe('Crypt and Decrypt Strings', () => {
  const cipher = createCipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);
  const decipher = createDecipheriv('aes-256-cbc', globalConfig.aesSecretKey, globalConfig.aesInitialVector);

  const randomString = randomBytes(31).toString('utf8');

  test('Compare Crypted and decrypted String', () => {
    const encodedString = cipher.update(randomString, 'utf8', 'base64') + cipher.final('base64');
    const decodedString = decipher.update(encodedString, 'base64', 'utf8') + decipher.final('utf8');

    expect(decodedString).toBe(randomString);
  });
});
