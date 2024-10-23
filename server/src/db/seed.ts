// popula o banco de dados com dados ficticios.

import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  //povoando o meu DB.
  const result = await db
    .insert(goals)
    .values([
      { title: 'acordar cedo', desireWeeklyFrequence: 5 },
      { title: 'fazer exercicios', desireWeeklyFrequence: 3 },
      { title: 'meditar', desireWeeklyFrequence: 2 },
    ])
    .returning() //faz com que o insert devolva os dados inseridos

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAT: startOfWeek.toDate() },
    { goalId: result[1].id, createdAT: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
