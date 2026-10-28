const { PrismaClient } = require('@prisma/client');
const { calculateProductivityScore } = require('../utils/scoreHelper');

const prisma = new PrismaClient();

async function getScore(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      select: { completed: true, important: true, completedAt: true },
    });
    return res.json(calculateProductivityScore(tasks));
  } catch (error) {
    console.error('Unable to calculate productivity score:', error);
    return res.status(500).json({ error: 'Failed to calculate productivity score' });
  }
}

module.exports = { getScore };
