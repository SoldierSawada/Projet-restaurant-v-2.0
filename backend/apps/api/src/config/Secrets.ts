import { readFileSync } from 'node:fs';

export function readSecret(name: string, env: NodeJS.ProcessEnv = process.env): string | undefined {
  const filePath = env[`${name}_FILE`];

  if (filePath) {
    const value = readFileSync(filePath, 'utf8').replace(/\r?\n$/, '');

    if (value === '') {
      throw new Error(`Le secret ${name} est vide (fichier ${filePath})`);
    }

    return value;
  }

  return env[name] || undefined;
}
