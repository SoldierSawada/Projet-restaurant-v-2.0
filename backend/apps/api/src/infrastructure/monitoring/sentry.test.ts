import * as Sentry from '@sentry/node';
import { describe, expect, it } from 'vitest';
import { scrubEvent } from './sentry';

describe('scrubEvent', () => {
  it('happy : masque l\'email présent dans le message', () => {
    const event = { message: 'Erreur pour marie@mail.fr' } as Sentry.ErrorEvent;

    expect(scrubEvent(event).message).toBe('Erreur pour m***@mail.fr');
  });

  it('happy : masque mot de passe, token et téléphone dans la requête', () => {
    const event = {
      request: {
        data: { email: 'jean@restaurant.fr', password: 'secret123', guestPhone: '0612345678' },
        headers: { authorization: 'Bearer xyz', cookie: 'session=abc' },
      },
    } as unknown as Sentry.ErrorEvent;

    expect(scrubEvent(event)).toEqual({
      request: {
        data: { email: 'j***@restaurant.fr', password: '[MASQUE]', guestPhone: '[MASQUE]' },
        headers: { authorization: '[MASQUE]', cookie: '[MASQUE]' },
      },
    });
  });

  it('death : accepte un événement sans données sensibles', () => {
    const event = { message: 'Erreur sans détail' } as Sentry.ErrorEvent;

    expect(scrubEvent(event)).toEqual({ message: 'Erreur sans détail' });
  });
});
