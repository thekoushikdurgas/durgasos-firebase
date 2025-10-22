import { WindowsLogo } from "@/components/system/WindowsLogo";

export function BootScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-white">
      <WindowsLogo className="w-20 h-20 mb-12" />
      <div className="relative">
        <div className="w-6 h-6 border-2 border-white/20 rounded-full" />
        <div className="absolute top-0 left-0 w-6 h-6 border-2 border-t-white border-r-white/0 border-b-white/0 border-l-white/0 rounded-full animate-spinner-spin" />
      </div>
    </div>
  );
}
