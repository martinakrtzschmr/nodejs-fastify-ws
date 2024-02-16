import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';

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

      const poll = await prisma.poll.create({
        
      });

      return res.status(201).send();
    }
  );
}
