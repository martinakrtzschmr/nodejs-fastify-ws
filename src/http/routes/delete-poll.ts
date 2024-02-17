import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';

export async function deletePoll(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.post('/polls/delete', async (req: FastifyRequest, res: FastifyReply) => {
    const deletePollParams = z.object({
      pollId: z.string(),
    });

    const { pollId } = deletePollParams.parse(req.params);

    const poll = await prisma.poll.delete({
      where: {
        id: pollId,
      },
    });

    return res.status(201).send(poll);
  });
}
