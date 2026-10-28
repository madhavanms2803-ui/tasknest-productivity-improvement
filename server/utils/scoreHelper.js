const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;

function calculateProductivityScore(tasks, now = new Date()) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalWeight = safeTasks.reduce((sum, task) => sum + (task.important ? 2 : 1), 0);
  const completedWeight = safeTasks.reduce(
    (sum, task) => sum + (task.completed ? (task.important ? 2 : 1) : 0),
    0,
  );

  const completionScore = totalWeight === 0
    ? 0
    : Math.round((completedWeight / totalWeight) * 80);

  const cutoff = now.getTime() - WINDOW_DAYS * DAY_MS;
  const activeDates = new Set();
  for (const task of safeTasks) {
    if (!task.completed || !task.completedAt) continue;
    const completedAt = new Date(task.completedAt);
    const timestamp = completedAt.getTime();
    if (Number.isNaN(timestamp) || timestamp < cutoff || timestamp > now.getTime()) continue;
    activeDates.add(completedAt.toISOString().slice(0, 10));
  }

  const activeDays = Math.min(activeDates.size, WINDOW_DAYS);
  const consistencyBonus = Math.round((activeDays / WINDOW_DAYS) * 20);
  const completedCount = safeTasks.filter((task) => task.completed).length;
  const importantCompleted = safeTasks.filter((task) => task.completed && task.important).length;
  const regularCompleted = completedCount - importantCompleted;

  return {
    value: Math.min(100, completionScore + consistencyBonus),
    completionScore,
    consistencyBonus,
    activeDays,
    windowDays: WINDOW_DAYS,
    totalCount: safeTasks.length,
    completedCount,
    importantCompleted,
    regularCompleted,
  };
}

module.exports = { calculateProductivityScore };
