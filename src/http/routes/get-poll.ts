import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';
import { redis } from '../../lib/redis';
import { arrayToStringNumberObject } from '../../lib/utils';

export async function getPoll(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.get('/polls/:pollId', async (req: FastifyRequest, res: FastifyReply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(req.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        pollOption: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) {
      return res.status(400).send({ message: 'Poll not found.' });
    }

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES');
    const votes = arrayToStringNumberObject(result);

    return res.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.pollOption.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
