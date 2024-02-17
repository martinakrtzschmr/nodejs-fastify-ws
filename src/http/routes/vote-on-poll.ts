import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function voteOnPoll(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.post(
    '/polls/:pollId/votes',
    async (req: FastifyRequest, res: FastifyReply) => {
      const voteOnPollBody = z.object({
        pollOptionId: z.string().uuid(),
      });
      const voteOnPollParams = z.object({
        pollId: z.string().uuid(),
      });

      const { pollOptionId } = voteOnPollBody.parse(req.body);
      const { pollId } = voteOnPollParams.parse(req.params);

      let { sessionId } = req.cookies;

      if (!sessionId) {
        sessionId = randomUUID();
        res.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      // const poll = await prisma.poll.create({});

      return res.status(201).send({ sessionId });
    }
  );
}
