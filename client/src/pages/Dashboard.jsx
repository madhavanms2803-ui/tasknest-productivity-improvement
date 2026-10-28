import { CheckCircle2, ListTodo, Star } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import ScoreWidget from '../components/ScoreWidget.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { fetchTasks } from '../services/api.js';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await fetchTasks());
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load tasks. Check that the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchTasks()
      .then((data) => {
        if (active) {
          setTasks(data);
          setError('');
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load tasks. Check that the API is running.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const completed = tasks.filter((task) => task.completed).length;
  const important = tasks.filter((task) => task.important && !task.completed).length;

  return (
    <>
      <header className="welcome-section">
        <div>
          <p className="eyebrow">A little progress adds up</p>
          <h1>Good work starts with focus.</h1>
          <p>Choose what matters, finish it, and see the reason your score changes.</p>
        </div>
      </header>

      <ScoreWidget tasks={tasks} />

      <div className="dashboard-grid">
        <section className="main-content" aria-labelledby="tasks-heading">
          <div className="stats-row">
            <div className="stat-card"><ListTodo size={18} /><span>All tasks</span><strong>{tasks.length}</strong></div>
            <div className="stat-card"><CheckCircle2 size={18} /><span>Completed</span><strong>{completed}</strong></div>
            <div className="stat-card"><Star size={18} /><span>Important left</span><strong>{important}</strong></div>
          </div>
          <div className="section-title">
            <div><p className="eyebrow">Your day</p><h2 id="tasks-heading">Task list</h2></div>
            <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>
          {error && <p className="page-error" role="alert">{error}</p>}
          {loading ? <div className="empty-state">Loading your tasks…</div> : (
            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-state"><span className="empty-icon"><ListTodo size={26} /></span><h3>A clear start</h3><p>Add your first task. Mark it important if it deserves extra focus.</p></div>
              ) : tasks.map((task) => <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />)}
            </div>
          )}
        </section>
        <aside className="sidebar-aside"><TaskForm onTaskCreated={loadTasks} /></aside>
      </div>
    </>
  );
}
