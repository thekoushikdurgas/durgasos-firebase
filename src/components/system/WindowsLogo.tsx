import { cn } from "@/lib/utils";

export function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-10 h-10 text-white", className)}
    >
      <path
        d="M0 37.0583L37.0583 32.2222V0H0V37.0583Z"
        fill="currentColor"
      />
      <path
        d="M42.9417 31.4286L80 26.5925V0H42.9417V31.4286Z"
        fill="currentColor"
      />
      <path
        d="M0 80L37.0583 75.1639V40.2361L0 45.0722V80Z"
        fill="currentColor"
      />
      <path
        d="M42.9417 75.9578L80 71.1217V34.6064L42.9417 39.4425V75.9578Z"
        fill="currentColor"
      />
    </svg>
  );
}
