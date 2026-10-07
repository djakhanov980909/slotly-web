import { useAuth } from '../auth/useAuth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <main className="card">
      <h1>Здравствуйте, {user?.name}!</h1>
      <p>Роль: {user?.role}</p>
      <button type="button" onClick={() => void logout()}>Выйти</button>
    </main>
  );
}