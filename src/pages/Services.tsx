import { Link } from 'react-router-dom';
import { useServices } from '../api/queries';
import { formatDuration, formatPrice } from '../lib/format';

export default function Services() {
  const { data, isPending, error } = useServices();

  if (isPending) {
    return <p>Загрузка…</p>;
  }

  if (error) {
    return <p className="error" role="alert">Не удалось загрузить услуги</p>;
  }

  return (
    <section>
      <h1>Услуги</h1>
      <ul className="grid">
        {data.data.map((service) => (
          <li key={service.id} className="card">
            <h2>{service.name}</h2>
            <p>{formatDuration(service.duration_minutes)} · {formatPrice(service.price)}</p>
            <Link to={`/services/${service.id}`} className="button">Выбрать</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}