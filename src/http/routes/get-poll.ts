import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';

export async function getPoll(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.get('/polls/:pollId', async (req: FastifyRequest, res: FastifyReply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    });

    const { pollId } = getPollParams.parse(req.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        pollOption: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return res.send({ poll });
  });
}
