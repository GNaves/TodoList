import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, count, eq, gte, lte, sql, SQL } from 'drizzle-orm'
import { number } from 'zod'

dayjs.extend(weekOfYear)

export async function getWeekPendingGoald() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_uo_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desireWeeklyFrequence: goals.desireWeeklyFrequence,
        createdAT: goals.createdAT,
      })
      .from(goals)
      .where(lte(goals.createdAT, lastDayOfWeek))
  )

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        completionCount: count(goalCompletions.id).as('completionCount'),
        goalId: goalCompletions.goalId,
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAT, firstDayOfWeek),
          lte(goalCompletions.createdAT, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desireWeeklyFrequence: goalsCreatedUpToWeek.desireWeeklyFrequence,
      completionCounts:
        sql /*sql*/`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )

  return { pendingGoals }
}
