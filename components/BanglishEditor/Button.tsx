interface ButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  onClick,
  active,
  disabled,
  className,
  children,
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
        p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${
          active
            ? "bg-blue-100 border-blue-500 text-blue-700"
            : "hover:bg-gray-100 border-gray-200"
        }
        ${className || ""}
      `}
  >
    {children}
  </button>
);

export default Button