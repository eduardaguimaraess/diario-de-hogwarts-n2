import type { FastifyInstance } from 'fastify';
import { requireAuthentication } from '../modules/auth/authGuards.js';
import {
  initialPotionsData,
  type CustomPotion
} from '../data/potionsData.js';

let potionsDb: CustomPotion[] = [...initialPotionsData];

export async function potionsRoutes(server: FastifyInstance) {
  server.get(
    '/potions',
    { preHandler: requireAuthentication },
    async (_request, reply) => {
      return reply.status(200).send(potionsDb);
    }
  );

  server.post(
    '/potions',
    { preHandler: requireAuthentication },
    async (request, reply) => {
      const { name, difficulty, effect, ingredients } = request.body as {
        name?: string;
        difficulty?: string;
        effect?: string;
        ingredients?: string;
      };

      if (!name || !effect) {
        return reply.status(400).send({
          error: 'Nome e efeito são obrigatórios.'
        });
      }

      const newPotion: CustomPotion = {
        id: String(Date.now()),
        name,
        difficulty: difficulty || 'Intermediário',
        effect,
        ingredients: ingredients || 'Ingredientes secretos'
      };

      potionsDb.push(newPotion);
      return reply.status(201).send(newPotion);
    }
  );
}