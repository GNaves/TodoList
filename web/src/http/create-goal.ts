interface CreateGoalRequest {
  title: string
  desireWeeklyFrequence: number
}

export async function createGoal({
  title,
  desireWeeklyFrequence,
}: CreateGoalRequest) {
  await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      desireWeeklyFrequence,
    }),
  })
}
