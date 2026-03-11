interface PreferenceToggleOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface PreferenceToggleProps<TValue extends string> {
  value: TValue;
  onChange: (value: TValue) => void;
  options: Array<PreferenceToggleOption<TValue>>;
}

const PreferenceToggle = <TValue extends string>({
  value,
  onChange,
  options,
}: PreferenceToggleProps<TValue>) => {
  return (
    <div className="flex rounded-xl border border-accent bg-light p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`rounded-lg px-3 py-1 text-sm font-semibold transition-colors ${
            option.value === value ? "bg-accent text-light" : "text-text"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PreferenceToggle;
