import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface BaseProps {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

interface InputProps extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  as?: 'input';
}

interface SelectProps extends BaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  as: 'select';
  children: ReactNode;
}

type FormFieldProps = InputProps | SelectProps;

export default function FormField(props: FormFieldProps) {
  const { label, id, hint, error, required, as = 'input', ...rest } = props;
  const cls = `field-control${error ? ' error' : ''}`;

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="field-required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {as === 'select' ? (
        <select
          id={id} className={cls}
          aria-invalid={!!error} aria-describedby={hint ? `${id}-hint` : undefined}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(rest as SelectProps).children}
        </select>
      ) : (
        <input
          id={id} className={cls}
          aria-invalid={!!error} aria-describedby={hint ? `${id}-hint` : undefined}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p className="field-error" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
