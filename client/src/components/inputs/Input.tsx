interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-primaryGray">{label}</p>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-[400px] rounded-xl border-2 border-black/5 bg-transparent px-4 py-2 outline-none transition duration-150 ease-in-out hover:border-black/15 focus:border-black/15 dark:border-white/5 dark:hover:border-white/15 dark:focus:border-white/15"
      />
    </div>
  );
}
