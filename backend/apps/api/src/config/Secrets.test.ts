import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readSecret } from './Secrets';

function writeSecretFile(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'secrets-'));
  const filePath = join(dir, 'secret.txt');
  writeFileSync(filePath, content);
  return filePath;
}

describe('readSecret', () => {
  it('happy : lit le secret dans le fichier désigné par NAME_FILE, sans le retour à la ligne final', () => {
    const filePath = writeSecretFile('mot-de-passe-secret\n');

    expect(readSecret('DB_PASSWORD', { DB_PASSWORD_FILE: filePath })).toBe('mot-de-passe-secret');
  });

  it('happy : utilise la variable simple quand aucun fichier n\'est donné', () => {
    expect(readSecret('DB_PASSWORD', { DB_PASSWORD: 'valeur-env' })).toBe('valeur-env');
  });

  it('death : renvoie undefined quand rien n\'est défini ou quand la variable est vide', () => {
    expect(readSecret('DB_PASSWORD', {})).toBeUndefined();
    expect(readSecret('DB_PASSWORD', { DB_PASSWORD: '' })).toBeUndefined();
  });

  it('death : échoue si le fichier désigné n\'existe pas', () => {
    expect(() => readSecret('DB_PASSWORD', { DB_PASSWORD_FILE: '/chemin/inexistant/secret' })).toThrow();
  });

  it('death : refuse un fichier de secret vide', () => {
    const filePath = writeSecretFile('\n');

    expect(() => readSecret('ADMIN_PASSWORD', { ADMIN_PASSWORD_FILE: filePath })).toThrow(/vide/);
  });
});
