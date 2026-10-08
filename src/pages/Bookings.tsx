import { Link } from 'react-router-dom';
import { useBookings, useCancelBooking } from '../api/queries';
import { errorMessage } from '../lib/errors';
import { formatDateTime, formatPrice, statusLabels } from '../lib/format';

export default function Bookings() {
  const { data, isPending, error } = useBookings();
  const cancel = useCancelBooking();

  if (isPending) {
    return <p>Загрузка…</p>;
  }

  if (error) {
    return <p className="error" role="alert">Не удалось загрузить записи</p>;
  }

  return (
    <section>
      <h1>Мои записи</h1>

      {cancel.error && <p className="error" role="alert">{errorMessage(cancel.error)}</p>}

      {data.data.length === 0 ? (
        <p>Записей пока нет. <Link to="/services">Выбрать услугу</Link></p>
      ) : (
        <ul className="list">
          {data.data.map((booking) => (
            <li key={booking.id} className="card booking">
              <div>
                <h2>{booking.service?.name}</h2>
                <p>{formatDateTime(booking.starts_at)}</p>
                <p>Специалист: {booking.specialist?.name} · {formatPrice(booking.price)}</p>
              </div>
              <div className="side">
                <span className={`badge ${booking.status}`}>{statusLabels[booking.status]}</span>
                {booking.can_cancel && (
                  <button
                    type="button"
                    className="danger"
                    disabled={cancel.isPending && cancel.variables === booking.id}
                    onClick={() => {
                      if (window.confirm('Отменить запись?')) {
                        cancel.mutate(booking.id);
                      }
                    }}
                  >
                    Отменить
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}