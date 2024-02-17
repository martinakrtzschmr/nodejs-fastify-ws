import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prima';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { redis } from '../../lib/redis';
import { voting } from '../../ws/voting-pub-sub';

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

      if (sessionId) {
        const userPreviousVoteOnPoll = await prisma.vote.findUnique({
          where: {
            sessionId_pollId: {
              sessionId,
              pollId,
            },
          },
        });

        if (
          userPreviousVoteOnPoll &&
          userPreviousVoteOnPoll.pollOptionId !== pollOptionId
        ) {
          await prisma.vote.delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            },
          });

          const votes = await redis.zincrby(
            pollId,
            -1,
            userPreviousVoteOnPoll.pollOptionId
          );

          voting.publish(pollId, {
            pollOptionId: userPreviousVoteOnPoll.pollOptionId,
            votes: Number(votes),
          });
        } else if (userPreviousVoteOnPoll) {
          return res
            .status(400)
            .send({ message: 'You alredy voted on this poll.' });
        }
      }

      if (!sessionId) {
        sessionId = randomUUID();
        res.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      const poll = await prisma.vote.create({
        data: {
          sessionId,
          pollId,
          pollOptionId,
        },
      });

      const votes = await redis.zincrby(pollId, 1, pollOptionId);
      voting.publish(pollId, {
        pollOptionId,
        votes: Number(votes),
      });

      return res.status(201).send({ poll });
    }
  );
}
