//criando conexão com o banco de dados!

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema' //pega todas as importações do meu aquivo schema.ts e coloca em uma variavel so.
import { env } from '../env'

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, {
  schema,
  logger: true /* da um log em todas as queries que fizermos no db */,
})
