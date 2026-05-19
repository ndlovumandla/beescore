import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" aria-label="BEEscore home">
          <span className="navbar-brand-icon" aria-hidden="true">B</span>
          <span>BEE<span>score</span></span>
        </NavLink>

        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
            Calculator
          </NavLink>
        </nav>

        <NavLink to="/calculator" className="navbar-link navbar-cta">
          Start Assessment
        </NavLink>
      </div>
    </header>
  );
}
