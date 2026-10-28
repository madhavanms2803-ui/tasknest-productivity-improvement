import { Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { createTask } from '../services/api.js';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [important, setImportant] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Add a task title first.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await createTask(title.trim(), important);
      setTitle('');
      setImportant(false);
      await onTaskCreated();
    } catch (err) {
      setError(err.message || 'Could not create the task.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-card">
      <div className="card-heading">
        <span className="form-icon"><Plus size={18} /></span>
        <div><h2>Add a task</h2><p>Make the next step concrete.</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          className="styled-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          maxLength={200}
          required
        />
        <label className="importance-option">
          <input
            type="checkbox"
            checked={important}
            onChange={(event) => setImportant(event.target.checked)}
          />
          <Star size={17} fill={important ? 'currentColor' : 'none'} />
          <span><strong>Important task</strong><small>Counts twice toward completion points</small></span>
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="primary-button" disabled={busy}>
          <Plus size={18} /> {busy ? 'Adding…' : 'Add task'}
        </button>
      </form>
      <p className="form-note">Your score is calculated from your task list, not from how many times you click.</p>
    </section>
  );
}
