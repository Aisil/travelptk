import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const prismaClientSingleton = () => {
  // Use absolute path in Next.js to ensure it finds dev.db relative to root
  const dbPath = path.join(process.cwd(), 'dev.db');
  
  // В Prisma 7 адаптер better-sqlite3 ожидает объект конфигурации с параметром url,
  // а не инстанс БД напрямую. Передаем абсолютный путь к файлу базы.
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  
  // Instantiate PrismaClient with the adapter
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobalV2: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobalV2 ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalV2 = prisma;
