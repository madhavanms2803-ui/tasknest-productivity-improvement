import { Award, CalendarCheck, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchScore } from '../services/api.js';

export default function ScoreWidget({ tasks }) {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchScore()
      .then((data) => {
        if (active) {
          setScore(data);
          setError('');
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load productivity score.');
      });
    return () => { active = false; };
  }, [tasks]);

  return (
    <section className="score-hero-card" aria-labelledby="score-heading">
      <div className="score-hero-left">
        <p className="eyebrow">Progress, made clear</p>
        <h2 id="score-heading">Your productivity</h2>
        <div className="score-big">
          {score ? score.value : '—'}<span>/ 100</span>
        </div>
        <p className="score-description">A transparent snapshot of task completion and recent consistency.</p>
        {error && <p className="inline-error" role="alert">{error}</p>}
      </div>
      <div className="score-breakdown">
        <div className="score-breakdown-title"><Award size={20} /><span>How it's calculated</span></div>
        <div className="score-metric">
          <span><CheckCircle2 size={17} /> Weighted completion</span>
          <strong>{score ? score.completionScore : '—'} <small>/ 80</small></strong>
        </div>
        <div className="score-metric">
          <span><CalendarCheck size={17} /> Active days · last 7 days</span>
          <strong>{score ? score.activeDays : '—'} <small>/ 7</small></strong>
        </div>
        <div className="score-metric">
          <span><TrendingUp size={17} /> Consistency bonus</span>
          <strong>{score ? score.consistencyBonus : '—'} <small>/ 20</small></strong>
        </div>
        <div className="score-footnote"><Target size={15} /> Important tasks carry twice the completion weight.</div>
      </div>
    </section>
  );
}
