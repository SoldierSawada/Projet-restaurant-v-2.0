import { describe, expect, it, vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { Request, Response } from 'express';
import { httpLogger } from './http-logger';

function fakeRequest(incomingId?: string): Request {
  return {
    header: (name: string) => (name === 'X-Request-Id' ? incomingId : undefined),
    method: 'GET',
    originalUrl: '/restaurant/tables',
  } as unknown as Request;
}

function fakeResponse() {
  const emitter = new EventEmitter();
  const headers: Record<string, string> = {};

  return Object.assign(emitter, {
    statusCode: 200,
    headers,
    setHeader(name: string, value: string) {
      headers[name] = value;
    },
  }) as unknown as Response & { headers: Record<string, string> };
}

describe('httpLogger', () => {
  it('happy : crée un identifiant de requête quand le client n\'en envoie pas', () => {
    const response = fakeResponse();
    const next = vi.fn();

    httpLogger(fakeRequest(), response, next);

    expect(response.headers['X-Request-Id']).toMatch(/^[0-9a-f-]{36}$/);
    expect(next).toHaveBeenCalledOnce();
  });

  it('happy : réutilise l\'identifiant envoyé par le client s\'il est valide', () => {
    const response = fakeResponse();

    httpLogger(fakeRequest('abc-123456789'), response, vi.fn());

    expect(response.headers['X-Request-Id']).toBe('abc-123456789');
  });

  it('death : remplace un identifiant envoyé par le client s\'il est trop court ou mal formé', () => {
    const response = fakeResponse();

    httpLogger(fakeRequest('court'), response, vi.fn());

    expect(response.headers['X-Request-Id']).not.toBe('court');
    expect(response.headers['X-Request-Id']).toMatch(/^[0-9a-f-]{36}$/);
  });
});
