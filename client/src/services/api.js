const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed. Please try again.');
  }
  return data;
}

export const fetchTasks = () => request('/tasks');

export const createTask = (title, important) => request('/tasks', {
  method: 'POST',
  body: JSON.stringify({ title, important }),
});

export const updateTask = (id, changes) => request('/tasks/' + id, {
  method: 'PATCH',
  body: JSON.stringify(changes),
});

export const updateTaskStatus = (id, completed) => updateTask(id, { completed });

export const updateTaskImportance = (id, important) => updateTask(id, { important });

export const deleteTaskFromApi = (id) => request('/tasks/' + id, { method: 'DELETE' });

export const fetchScore = () => request('/score');
