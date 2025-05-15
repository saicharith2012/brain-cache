interface InputProps {
  onChange?: () => void;
  placeholder: string;
}

export default function InputComponent({ onChange, placeholder }: InputProps) {
  return (
    <input
      type="text"
      className="px-4 py-2 border rounded mb-2 w-full"
      placeholder={placeholder}
      onChange={onChange}
    ></input>
  );
}
