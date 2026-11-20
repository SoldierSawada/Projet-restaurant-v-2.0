const mask = '[MASQUE]';

const secretKeys = ['password', 'motdepasse', 'token', 'authorization', 'secret', 'cookie'];

const emailPattern = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

const secretPairPattern =
  /(["']?[\w-]*(?:password|motdepasse|token|authorization|secret|cookie|phone|telephone)[\w-]*["']?\s*[:=]\s*)("[^"]*"|[^\s,}&;]+)/gi;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[-_]/g, '');
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return mask;
  }

  return `${localPart.charAt(0)}***@${domain}`;
}

function maskSecretPairsInText(text: string): string {
  return text.replace(secretPairPattern, (_match, key: string) => `${key}"${mask}"`);
}

function maskEmailsInText(text: string): string {
  return maskSecretPairsInText(text).replace(emailPattern, (email) => maskEmail(email));
}

function maskField(key: string, value: unknown): unknown {
  const normalizedKey = normalizeKey(key);

  if (secretKeys.some((secretKey) => normalizedKey.includes(secretKey))) {
    return mask;
  }

  if (normalizedKey.includes('phone') || normalizedKey.includes('telephone')) {
    return mask;
  }

  if (normalizedKey.includes('email') && typeof value === 'string') {
    return maskEmail(value);
  }

  return sanitize(value);
}

export function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return maskEmailsInText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: maskEmailsInText(value.message),
      stack: value.stack,
    };
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
      result[key] = maskField(key, item);
    }

    return result;
  }

  return value;
}
