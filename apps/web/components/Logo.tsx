import Image from "next/image";

type LogoSize = "md" | "lg";

interface LogoProps {
  className?: string;
  size: LogoSize;
}

const LogoImageStyles: Record<LogoSize, { height: number; width: number }> = {
  md: { height: 32, width: 40 },
  lg: { height: 48, width: 60 },
};

const LogoHeadingStyles: Record<LogoSize, string> = {
  md: "text-2xl font-semibold",
  lg: "text-6xl font-extrabold",
};

export default function Logo({ className, size }: LogoProps) {
  return (
    <div className={`${className} flex items-center`}>
      <Image
        src="/braincache-logo.png"
        className={`mr-2`}
        alt="logo image"
        width={LogoImageStyles[size].width}
        height={LogoImageStyles[size].height}
      />
      <h1 className={`${LogoHeadingStyles[size]}`}>Braincache.</h1>
    </div>
  );
}
