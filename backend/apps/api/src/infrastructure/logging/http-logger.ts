import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { logger, requestContext } from './logger';

const silentPaths = ['/status', '/metrics'];

const validRequestId = /^[A-Za-z0-9-]{8,64}$/;

function levelForStatus(status: number): 'info' | 'warn' | 'error' {
  if (status >= 500) {
    return 'error';
  }

  if (status >= 400) {
    return 'warn';
  }

  return 'info';
}

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header('X-Request-Id');
  const requestId = incomingId && validRequestId.test(incomingId) ? incomingId : uuidv4();
  const startedAt = process.hrtime.bigint();

  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const path = req.originalUrl.split('?')[0];

    if (silentPaths.includes(path)) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.log(levelForStatus(res.statusCode), 'Requête HTTP', {
      requestId,
      method: req.method,
      path,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      memberId: (req as AuthenticatedRequest).identity?.memberId,
    });
  });

  requestContext.run({ requestId }, () => next());
}
