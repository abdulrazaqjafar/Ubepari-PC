import Image from "next/image";

type LogoVariant = "nav" | "full" | "mark";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

const SIZES: Record<
  LogoVariant,
  { width: number; height: number; className: string }
> = {
  nav: {
    width: 100,
    height: 140,
    className: "h-11 w-auto sm:h-12",
  },
  full: {
    width: 280,
    height: 390,
    className: "h-44 w-auto sm:h-52",
  },
  mark: {
    width: 56,
    height: 56,
    className: "h-11 w-11",
  },
};

export default function Logo({
  variant = "nav",
  className = "",
  priority = false,
}: LogoProps) {
  const size = SIZES[variant];
  const src = variant === "mark" ? "/brand/logo-mark.png" : "/brand/logo.png";

  return (
    <Image
      src={src}
      alt="Ubepari PC"
      width={size.width}
      height={size.height}
      priority={priority}
      unoptimized
      className={`select-none object-contain ${className || size.className}`}
      style={{ width: "auto" }}
    />
  );
}
