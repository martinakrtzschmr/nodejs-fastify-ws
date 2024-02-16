import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';

import fastify from 'fastify';

const app = fastify({
  logger: true,
});

app.register(createPoll);
app.register(getPoll);

const start = async () => {
  try {
    await app.listen({ port: 3333 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
