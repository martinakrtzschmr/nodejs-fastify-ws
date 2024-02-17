import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { voting } from './voting-pub-sub';

export async function pollResults(app: FastifyInstance) {
  // @ts-ignore: Package version diffrence
  app.get(
    '/polls/:pollId/results',
    { websocket: true },
    (connection, request) => {
      connection.socket.send('WebSocket connected.');
      // Inscrever apenas nas mensagens publicadas no canal com o ID da enquete ('pollId')
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      });

      const { pollId } = getPollParams.parse(request.params);

      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
