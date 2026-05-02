import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const BASE =
  'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2';
const FOCUS = 'focus:border-[var(--accent)] focus:ring-[var(--accent)]/20';

// ── Input ────────────────────────────────────────────────────────────────────

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string; error?: string; hint?: string;
};

export function AdminInput({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        className={`${BASE} ${FOCUS} ${error ? 'border-red-400 focus:ring-red-400/20' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────────────

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string; error?: string; hint?: string;
};

export function AdminTextarea({ label, error, hint, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        className={`${BASE} ${FOCUS} min-h-[90px] resize-y ${error ? 'border-red-400 focus:ring-red-400/20' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

interface SelectProps {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  hint?: string;
}

export function AdminSelect({ label, name, defaultValue, options, hint }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select className={`${BASE} ${FOCUS} cursor-pointer`} name={name} defaultValue={defaultValue}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ── Color field ───────────────────────────────────────────────────────────────

interface ColorFieldProps { label: string; name: string; defaultValue?: string; }

export function AdminColorField({ label, name, defaultValue = '#1084a2' }: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          name={`${name}_picker`}
          defaultValue={defaultValue}
          className="w-9 h-9 rounded-lg border border-border bg-background p-1 cursor-pointer shrink-0"
          onChange={(e) => {
            const sibling = e.target.nextElementSibling as HTMLInputElement | null;
            if (sibling) sibling.value = e.target.value;
          }}
        />
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          className={`${BASE} ${FOCUS}`}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
