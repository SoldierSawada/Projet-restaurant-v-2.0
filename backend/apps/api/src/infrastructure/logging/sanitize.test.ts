import { describe, expect, it } from 'vitest';
import { maskEmail, sanitize } from './sanitize';

describe('sanitize', () => {
  it('happy : masque les mots de passe, les tokens et les téléphones', () => {
    expect(sanitize({ password: 'secret123', token: 'abc', guestPhone: '0612345678' })).toEqual({
      password: '[MASQUE]',
      token: '[MASQUE]',
      guestPhone: '[MASQUE]',
    });
  });

  it('happy : masque l\'email en gardant le domaine', () => {
    expect(sanitize({ email: 'jean.dupont@restaurant.fr' })).toEqual({ email: 'j***@restaurant.fr' });
  });

  it('happy : masque les emails présents dans un texte', () => {
    expect(sanitize('Contact : marie@mail.fr')).toBe('Contact : m***@mail.fr');
  });

  it('happy : masque les mots de passe et téléphones écrits dans un texte JSON', () => {
    expect(sanitize('{"email":"jean@restaurant.fr","password":"secret123","guestPhone":"0612345678"}')).toBe(
      '{"email":"j***@restaurant.fr","password":"[MASQUE]","guestPhone":"[MASQUE]"}',
    );
  });

  it('happy : garde les champs normaux', () => {
    expect(sanitize({ memberId: 'abc', status: 200 })).toEqual({ memberId: 'abc', status: 200 });
  });

  it('happy : masque aussi les données imbriquées dans un tableau', () => {
    expect(sanitize([{ authorization: 'Bearer xyz' }])).toEqual([{ authorization: '[MASQUE]' }]);
  });

  it('death : accepte une valeur vide sans planter', () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize(undefined)).toBeUndefined();
  });

  it('death : masque un email mal formé', () => {
    expect(maskEmail('pas-un-email')).toBe('[MASQUE]');
  });
});
