import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/useAuth';
import Field from '../components/Field';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await register({ ...form, phone: form.phone || undefined });
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(err instanceof ApiError ? err.errors : { name: ['Не удалось зарегистрироваться'] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="card">
      <h1>Регистрация</h1>
      <form onSubmit={onSubmit}>
        <Field label="Имя" name="name" value={form.name} onChange={set('name')} error={errors.name?.[0]} autoComplete="name" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email?.[0]} autoComplete="email" />
        <Field label="Телефон (необязательно)" name="phone" value={form.phone} onChange={set('phone')} error={errors.phone?.[0]} autoComplete="tel" />
        <Field label="Пароль" name="password" type="password" value={form.password} onChange={set('password')} error={errors.password?.[0]} autoComplete="new-password" />
        <Field label="Повторите пароль" name="password_confirmation" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} autoComplete="new-password" />
        <button type="submit" disabled={submitting}>{submitting ? 'Создаём…' : 'Создать аккаунт'}</button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </main>
  );
}