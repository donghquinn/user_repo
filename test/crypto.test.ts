import { decryptString, encryptString } from '@libraries/Crypto';
import { randomBytes } from 'node:crypto';

describe('Crypt and Decrypt Strings', () => {
  const randomString = randomBytes(31).toString('utf8');

  test('Compare Crypted and decrypted String', () => {
    const encodedString = encryptString(randomString);
    const decodedString = decryptString(encodedString);

    expect(decodedString).toBe(randomString);
  });
});
