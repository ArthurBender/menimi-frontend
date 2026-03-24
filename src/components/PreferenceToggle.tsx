interface PreferenceToggleOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface PreferenceToggleProps<TValue extends string> {
  value: TValue;
  onChange: (value: TValue) => void;
  options: Array<PreferenceToggleOption<TValue>>;
  disabled?: boolean;
}

const PreferenceToggle = <TValue extends string>({
  value,
  onChange,
  options,
  disabled = false,
}: PreferenceToggleProps<TValue>) => {
  return (
    <div className="flex rounded-xl border border-accent bg-light p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`rounded-lg px-3 py-1 text-sm font-semibold transition-colors ${
            option.value === value ? "bg-accent text-light" : "text-text"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          onClick={() => onChange(option.value)}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PreferenceToggle;
