interface InputProps {
  placeholder: string;
  ref?: React.RefObject<HTMLInputElement | null>
}

export default function InputComponent(props: InputProps) {
  return (
    <input
      type="text"
      className="px-4 py-2 border rounded mb-2 w-full"
      placeholder={props.placeholder}
      ref={props.ref}
    ></input>
  );
}
