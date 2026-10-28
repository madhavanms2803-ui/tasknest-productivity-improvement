import { CheckSquare, LayoutDashboard, ListTodo } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <NavLink to="/" className="logo-container" aria-label="TaskNest home">
          <span className="logo-icon"><CheckSquare size={20} strokeWidth={3} /></span>
          <span className="logo-text">TaskNest</span>
        </NavLink>
        <div className="nav-menu">
          <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={18} /><span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ListTodo size={18} /><span>All tasks</span>
          </NavLink>
        </div>
        <span className="profile-mark" aria-label="Your workspace">TN</span>
      </div>
    </nav>
  );
}
