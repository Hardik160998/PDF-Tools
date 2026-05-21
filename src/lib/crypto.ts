import crypto from 'crypto';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Derive a 32-byte key from the service role key
const getSecretKey = () => {
  return crypto.createHash('sha256').update(serviceRoleKey).digest();
};

export function encryptPayload(payload: any): string {
  const key = getSecretKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Return IV concatenated with encrypted data, separated by a colon
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptPayload(token: string): any {
  const key = getSecretKey();
  const [ivHex, encryptedHex] = token.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid token format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}
