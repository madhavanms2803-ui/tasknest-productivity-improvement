const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateProductivityScore } = require('../utils/scoreHelper');

const now = new Date('2026-10-28T12:00:00.000Z');

test('returns zero for an empty task list', () => {
  assert.deepEqual(calculateProductivityScore([], now), {
    value: 0,
    completionScore: 0,
    consistencyBonus: 0,
    activeDays: 0,
    windowDays: 7,
    totalCount: 0,
    completedCount: 0,
    importantCompleted: 0,
    regularCompleted: 0,
  });
});

test('weights completed important tasks twice as much as regular tasks', () => {
  const tasks = [
    { completed: true, important: true, completedAt: '2026-10-28T08:00:00.000Z' },
    { completed: false, important: false, completedAt: null },
  ];
  const result = calculateProductivityScore(tasks, now);
  assert.equal(result.completionScore, 53);
  assert.equal(result.importantCompleted, 1);
  assert.equal(result.completedCount, 1);
  assert.equal(result.activeDays, 1);
  assert.equal(result.consistencyBonus, 3);
  assert.equal(result.value, 56);
});

test('counts only distinct completion days within the trailing seven-day window', () => {
  const tasks = [
    { completed: true, important: false, completedAt: '2026-10-28T08:00:00.000Z' },
    { completed: true, important: false, completedAt: '2026-10-28T09:00:00.000Z' },
    { completed: true, important: false, completedAt: '2026-10-25T09:00:00.000Z' },
    { completed: true, important: false, completedAt: '2026-10-20T09:00:00.000Z' },
    { completed: true, important: false, completedAt: '2026-10-29T09:00:00.000Z' },
  ];
  const result = calculateProductivityScore(tasks, now);
  assert.equal(result.activeDays, 2);
  assert.equal(result.consistencyBonus, 6);
});

test('caps score at 100 and ignores missing or invalid timestamps', () => {
  const tasks = [];
  for (let day = 0; day < 7; day += 1) {
    const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
    tasks.push({ completed: true, important: true, completedAt: date.toISOString() });
  }
  tasks.push({ completed: true, important: false, completedAt: 'not-a-date' });
  const result = calculateProductivityScore(tasks, now);
  assert.equal(result.activeDays, 7);
  assert.equal(result.value, 100);
});
