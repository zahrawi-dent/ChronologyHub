
export const Badge = (props: { variant?: "default" | "secondary" | "destructive" | "outline", className?: string, children?: any }) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground"
  };

  const variantClass = variants[props.variant!] || variants.default;
  const combinedClass = `${baseClasses} ${variantClass} ${props.className || ''}`;

  return (
    <div class={combinedClass}>
      {props.children}
    </div>
  );
};
