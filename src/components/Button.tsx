
// Button Component
export const Button = (props: { variant?: "default" | "secondary" | "destructive" | "outline", size?: "default" | "sm" | "lg" | "icon", className?: string, children?: any, onClick?: () => void, disabled?: boolean }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  };

  const variantClass = variants[props.variant!] || variants.default;
  const sizeClass = sizes[props.size!] || sizes.default;
  const combinedClass = `${baseClasses} ${variantClass} ${sizeClass} ${props.className || ''}`;

  return (
    <button
      class={combinedClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
