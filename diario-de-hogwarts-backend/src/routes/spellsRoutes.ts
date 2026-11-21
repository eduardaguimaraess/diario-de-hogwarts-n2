import type { FastifyInstance } from 'fastify';
import { requireAuthentication } from '../modules/auth/authGuards.js';
import {
  initialSpellsData,
  type CustomSpell
} from '../data/spellsData.js';

let spellsDb: CustomSpell[] = [...initialSpellsData];

export async function spellsRoutes(server: FastifyInstance) {
  server.get(
    '/spells',
    { preHandler: requireAuthentication },
    async (_request, reply) => {
      return reply.status(200).send(spellsDb);
    }
  );

  server.post(
    '/spells',
    { preHandler: requireAuthentication },
    async (request, reply) => {
      const { name, category, effect } = request.body as {
        name?: string;
        category?: string;
        effect?: string;
      };

      if (!name || !category || !effect) {
        return reply.status(400).send({
          error: 'Todos os campos (nome, categoria, efeito) são obrigatórios.'
        });
      }

      const newSpell: CustomSpell = {
        id: String(Date.now()),
        name,
        category,
        effect
      };

      spellsDb.push(newSpell);
      return reply.status(201).send(newSpell);
    }
  );
}