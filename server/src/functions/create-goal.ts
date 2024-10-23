import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequest {
  title: string
  desireWeeklyFrequence: number
}

export async function createGoal({
  title,
  desireWeeklyFrequence,
}: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desireWeeklyFrequence,
    })
    .returning()

  const goal = result[0]

  return {
    goal,
  }
}
