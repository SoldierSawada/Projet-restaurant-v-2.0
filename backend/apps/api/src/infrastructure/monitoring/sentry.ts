import * as Sentry from '@sentry/node';
import { requestContext } from '../logging/logger';
import { sanitize } from '../logging/sanitize';

export function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  return sanitize(event) as Sentry.ErrorEvent;
}

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? 'production',
    sendDefaultPii: false,
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
  });
}

export function captureError(error: unknown): void {
  const requestId = requestContext.getStore()?.requestId;

  Sentry.withScope((scope) => {
    if (requestId) {
      scope.setTag('requestId', requestId);
    }

    Sentry.captureException(error);
  });
}
