import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import './SearchableSelect.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  id,
  className = '',
}: Props) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const containerRef      = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleOpen() {
    if (disabled) return;
    setOpen(true);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSelect(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    } else if (e.key === 'Enter' && filtered.length === 1) {
      handleSelect(filtered[0]);
    }
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className={`searchSelect${disabled ? ' searchSelect--disabled' : ''} ${className}`.trim()}
    >
      {!open ? (
        <button
          type="button"
          className="searchSelect__trigger"
          onClick={handleOpen}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={false}
        >
          <span className={selectedLabel ? '' : 'searchSelect__placeholder'}>
            {selectedLabel || placeholder}
          </span>
          <ChevronIcon />
        </button>
      ) : (
        <div className="searchSelect__inputWrap">
          <input
            ref={inputRef}
            className="searchSelect__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search…"
            aria-autocomplete="list"
          />
          <ChevronIcon open />
        </div>
      )}

      {open && (
        <ul className="searchSelect__dropdown" role="listbox">
          {filtered.length === 0 && (
            <li className="searchSelect__empty">No results</li>
          )}
          {filtered.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`searchSelect__option${o.value === value ? ' searchSelect__option--selected' : ''}`}
              onMouseDown={() => handleSelect(o)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : undefined, flexShrink: 0 }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
