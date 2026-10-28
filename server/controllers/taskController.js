const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const MAX_TITLE_LENGTH = 200;

function parseTaskId(rawId) {
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isPrismaNotFound(error) {
  return error && error.code === 'P2025';
}

async function getTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { completed: 'asc' },
        { important: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return res.json(tasks);
  } catch (error) {
    console.error('Unable to fetch tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

async function createTask(req, res) {
  const rawTitle = req.body && req.body.title;
  const important = req.body && req.body.important;

  if (typeof rawTitle !== 'string' || !rawTitle.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }
  if (rawTitle.trim().length > MAX_TITLE_LENGTH) {
    return res.status(400).json({ error: 'Task title must be 200 characters or fewer' });
  }
  if (important !== undefined && typeof important !== 'boolean') {
    return res.status(400).json({ error: 'Important must be a boolean' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: rawTitle.trim(),
        important: important === true,
      },
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error('Unable to create task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
}

async function updateTask(req, res) {
  const id = parseTaskId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Task id must be a positive integer' });

  const body = req.body || {};
  const hasCompleted = Object.prototype.hasOwnProperty.call(body, 'completed');
  const hasImportant = Object.prototype.hasOwnProperty.call(body, 'important');

  if (!hasCompleted && !hasImportant) {
    return res.status(400).json({ error: 'Provide completed and/or important to update' });
  }
  if (hasCompleted && typeof body.completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }
  if (hasImportant && typeof body.important !== 'boolean') {
    return res.status(400).json({ error: 'Important must be a boolean' });
  }

  try {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const data = {};
    if (hasImportant) data.important = body.important;
    if (hasCompleted) {
      data.completed = body.completed;
      if (body.completed && !existing.completed) {
        data.completedAt = new Date();
      } else if (!body.completed && existing.completed) {
        data.completedAt = null;
      }
    }

    const task = await prisma.task.update({ where: { id }, data });
    return res.json(task);
  } catch (error) {
    console.error('Unable to update task:', error);
    if (isPrismaNotFound(error)) return res.status(404).json({ error: 'Task not found' });
    return res.status(500).json({ error: 'Failed to update task' });
  }
}

async function deleteTask(req, res) {
  const id = parseTaskId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Task id must be a positive integer' });

  try {
    await prisma.task.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (isPrismaNotFound(error)) return res.status(404).json({ error: 'Task not found' });
    console.error('Unable to delete task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
