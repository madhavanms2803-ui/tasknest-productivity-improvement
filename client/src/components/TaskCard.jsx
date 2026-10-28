import { Check, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteTaskFromApi, updateTaskImportance, updateTaskStatus } from '../services/api.js';

export default function TaskCard({ task, onTaskUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function runAction(action) {
    setBusy(true);
    setError('');
    try {
      await action();
      await onTaskUpdated();
    } catch (err) {
      setError(err.message || 'Could not update this task.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={'task-card' + (task.completed ? ' is-completed' : '') + (task.important ? ' is-important' : '')}>
      <button
        type="button"
        className={'custom-checkbox' + (task.completed ? ' checked' : '')}
        aria-label={task.completed ? 'Mark ' + task.title + ' incomplete' : 'Complete ' + task.title}
        aria-pressed={task.completed}
        disabled={busy}
        onClick={() => runAction(() => updateTaskStatus(task.id, !task.completed))}
      >
        {task.completed && <Check size={17} strokeWidth={3} />}
      </button>
      <div className="task-content">
        <span className="task-text">{task.title}</span>
        <div className="task-meta">
          <span className={'priority-label' + (task.important ? ' priority-high' : '')}>
            {task.important ? 'Important · 2× weight' : 'Regular task'}
          </span>
          {task.completed && <span className="completed-label">Completed</span>}
        </div>
        {error && <span className="task-error" role="alert">{error}</span>}
      </div>
      <div className="task-actions">
        <button
          type="button"
          className={'icon-button' + (task.important ? ' selected' : '')}
          aria-label={(task.important ? 'Remove importance from ' : 'Mark as important: ') + task.title}
          aria-pressed={Boolean(task.important)}
          title={task.important ? 'Remove important flag' : 'Mark important'}
          disabled={busy}
          onClick={() => runAction(() => updateTaskImportance(task.id, !task.important))}
        >
          <Star size={18} fill={task.important ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          className="icon-button danger"
          aria-label={'Delete ' + task.title}
          title="Delete task"
          disabled={busy}
          onClick={() => runAction(() => deleteTaskFromApi(task.id))}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
