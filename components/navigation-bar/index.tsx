import Class from 'classnames';
import NavItem from './navbar-item';
import styles from '../../styles/navigation-bar.module.css';

export default function Navbar() {
  const classNavbar = Class(
    'navbar',
    'navbar-expand-lg',
    'navbar-dark',
    'px-5',
    styles['navbar-custom']
  );

  return (
    <section className={styles['navbar-menu']}>
      <nav className={classNavbar}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav m-auto">
              <NavItem title="Home" />
              <NavItem title="Movies" />
              <NavItem title="Favorites" />
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
}
