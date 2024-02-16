import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';
import { Server } from 'http';

export async function createPoll(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.get('/', async (request: FastifyRequest, response: FastifyReply) => {
    return { greeting: 'Hello from Fastify and TypeScript!' };
  });
  
  // @ts-ignore: Package version diffrence
  app.post('/polls/create', async (req: FastifyRequest, res: FastifyReply) => {
    const createPollBody = z.object({
      title: z.string(),
    });
  
    const { title } = createPollBody.parse(req.body);
  
    const poll = await prisma.poll.create({
      data: {
        title
      }
    })
  
    return res.status(201).send(poll);
  });
}