import clsx from "clsx";

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-6", className)}>{children}</div>;
}
