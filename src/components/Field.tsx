interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
}

export default function Field({ label, name, value, onChange, type = 'text', error, autoComplete }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <small className="error">{error}</small>}
    </label>
  );
}