import 'reflect-metadata';
import { createServer } from 'http';
import express from 'express';
import { setup } from './config/SetUp';
import { logger } from './infrastructure/logging/logger';
import { initSentry } from './infrastructure/monitoring/sentry';

initSentry();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

(async () => {
  await setup(app, server);

  server.listen(port, () => {
    logger.info('Serveur démarré', {
      port,
      url: `http://localhost:${port}/restaurant`,
    });
  });
})();
