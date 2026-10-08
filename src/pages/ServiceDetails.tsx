import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCreateBooking, useService, useSlots } from '../api/queries';
import { errorMessage } from '../lib/errors';
import { formatDuration, formatPrice } from '../lib/format';

const today = () => new Date().toLocaleDateString('en-CA');

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = useService(id);
  const createBooking = useCreateBooking();

  const [specialistId, setSpecialistId] = useState<number | null>(null);
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState<string | null>(null);

  const slots = useSlots(specialistId, id, date);

  if (service.isPending) {
    return <p>Загрузка…</p>;
  }

  if (service.error) {
    return <p className="error" role="alert">Услуга не найдена</p>;
  }

  const { name, description, duration_minutes, price, specialists = [] } = service.data.data;

  function chooseSpecialist(value: number) {
    createBooking.reset();
    setSpecialistId(value);
    setSlot(null);
  }

  function changeDate(value: string) {
    createBooking.reset();
    setDate(value);
    setSlot(null);
  }

  function selectSlot(time: string) {
    createBooking.reset();
    setSlot(time);
  }

  function book() {
    if (specialistId === null || slot === null || !id) {
      return;
    }

    createBooking.mutate(
      { specialist_id: specialistId, service_id: Number(id), date, time: slot },
      {
        onSuccess: () => navigate('/bookings'),
        onError: () => setSlot(null),
      },
    );
  }

  return (
    <section>
      <p><Link to="/services">← Все услуги</Link></p>
      <h1>{name}</h1>
      {description && <p>{description}</p>}
      <p>{formatDuration(duration_minutes)} · {formatPrice(price)}</p>

      <h2>Специалист</h2>
      {specialists.length === 0 ? (
        <p>Пока нет специалистов для этой услуги.</p>
      ) : (
        <div className="chips" role="radiogroup" aria-label="Специалист">
          {specialists.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={specialistId === s.id}
              className={specialistId === s.id ? 'chip active' : 'chip'}
              onClick={() => chooseSpecialist(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {specialistId !== null && (
        <>
          <h2>Дата</h2>
          <input type="date" value={date} min={today()} onChange={(e) => changeDate(e.target.value)} />

          {date && (
            <>
              <h2>Время</h2>
              {slots.isPending && <p>Загрузка…</p>}
              {slots.error && <p className="error" role="alert">Не удалось загрузить время</p>}
              {slots.data &&
                (slots.data.data.slots.length === 0 ? (
                  <p>На эту дату нет свободного времени.</p>
                ) : (
                  <>
                    <div className="chips">
                      {slots.data.data.slots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          aria-pressed={slot === time}
                          className={slot === time ? 'chip active' : 'chip'}
                          onClick={() => selectSlot(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <p className="hint">Время указано в поясе {slots.data.data.timezone}</p>
                  </>
                ))}
            </>
          )}
        </>
      )}

      {createBooking.error && (
        <p className="error" role="alert">{errorMessage(createBooking.error)}</p>
      )}

      {slot && (
        <div className="summary">
          <p>Вы выбрали: {date}, {slot}</p>
          <button type="button" onClick={book} disabled={createBooking.isPending}>
            {createBooking.isPending ? 'Записываем…' : 'Записаться'}
          </button>
        </div>
      )}
    </section>
  );
}