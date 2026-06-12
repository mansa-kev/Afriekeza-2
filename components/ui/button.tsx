import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-white hover:bg-[#32b340] shadow-sm hover:shadow-lg hover:shadow-green/25 active:scale-[0.98]",
  secondary:
    "bg-blue text-white hover:bg-blue/90 shadow-sm hover:shadow-md hover:shadow-blue/20",
  outline:
    "border border-soft-border bg-white text-dark hover:bg-off-white hover:border-blue/30",
  ghost: "text-dark hover:bg-soft-blue/60",
  white:
    "bg-white text-navy hover:bg-off-white shadow-sm border border-white/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-7 text-base",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
