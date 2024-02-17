import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import { pollResults } from '../ws/poll-results';

import websocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';

import fastify from 'fastify';

const app = fastify({
  logger: true,
});

/* Server cookie */
app.register(fastifyCookie, {
  // for cookies signature
  secret: 'polls-app',
  // set to false to disable cookie autoparsing or set autoparsing on any of the
  // following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'.
  // default: 'onRequest'
  hook: 'onRequest',
  // options for parsing cookies
  // parseOptions: {},
});

/* Websocket routes */
app.register(websocket);

/* Server routes */
app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(pollResults);

const start = async () => {
  try {
    await app.listen({ port: 3333 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
