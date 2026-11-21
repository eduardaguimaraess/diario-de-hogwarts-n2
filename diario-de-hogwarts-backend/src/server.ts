import Fastify from 'fastify';
import cors from '@fastify/cors';
import secureSession from '@fastify/secure-session';
import { authRoutes } from './modules/auth/authRoutes.js';
import { scheduleHistoryRoutes } from './routes/scheduleHistoryRoutes.js';
import { scheduleRoutes } from './routes/scheduleRoutes.js';
import { spellsRoutes } from './routes/spellsRoutes.js';
import { potionsRoutes } from './routes/potionsRoutes.js';
import { database } from './database/connection.js';
import {
  closeMongoConnection,
  connectMongo
} from './database/mongodbConnection.js';

const server = Fastify({
  logger: true
});

function getSessionKey(): Buffer {
  const keyHex = process.env.SESSION_KEY;

  if (!keyHex || !/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error(
      'SESSION_KEY precisa conter 64 caracteres hexadecimais.'
    );
  }

  return Buffer.from(keyHex, 'hex');
}

async function main() {
  try {
    const sessionKey = getSessionKey();

    await server.register(cors, {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type']
    });

    await server.register(secureSession, {
      key: sessionKey,
      expiry: 8 * 60 * 60,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60
      }
    });

    server.get('/health', async () => {
      return {
        status: 'OK',
        message: 'Servidor de Hogwarts ativo e operacional!'
      };
    });

    await server.register(authRoutes);
    await server.register(scheduleHistoryRoutes);
    await server.register(scheduleRoutes);
    await server.register(spellsRoutes);
    await server.register(potionsRoutes);

    await database.query('SELECT 1');
    console.log('Conexão com o MySQL estabelecida.');

    await connectMongo();
    console.log('Conexão com o MongoDB estabelecida.');

    await server.listen({ port: 3333, host: '0.0.0.0' });
    console.log(
      '⚡ Servidor Fastify rodando na porta HTTP http://localhost:3333'
    );
  } catch (error) {
    server.log.error(error);

    await Promise.allSettled([
      database.end(),
      closeMongoConnection()
    ]);

    process.exit(1);
  }
}

main();