import { ListTodo } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard.jsx';
import { fetchTasks } from '../services/api.js';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await fetchTasks());
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  return (
    <section className="tasks-page">
      <header className="welcome-section">
        <p className="eyebrow">Everything in one place</p>
        <h1>All tasks</h1>
        <p>Update importance, complete work, or remove tasks you no longer need.</p>
      </header>
      <div className="section-title"><div><h2><ListTodo size={22} /> Master list</h2><p>{tasks.length} tasks total</p></div></div>
      {error && <p className="page-error" role="alert">{error}</p>}
      {loading ? <div className="empty-state">Loading tasks…</div> : (
        <div className="task-list">
          {tasks.length === 0
            ? <div className="empty-state"><h3>No tasks yet</h3><p>Create one from the Dashboard to get started.</p></div>
            : tasks.map((task) => <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />)}
        </div>
      )}
    </section>
  );
}
