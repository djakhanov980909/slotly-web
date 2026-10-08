import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="header">
        <Link to="/services" className="brand">Slotly</Link>
        <nav className="nav">
          <Link to="/services">Услуги</Link>
          <Link to="/bookings">Мои записи</Link>
        </nav>
        <span className="spacer">{user?.name}</span>
        <button type="button" onClick={() => void logout()}>Выйти</button>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}