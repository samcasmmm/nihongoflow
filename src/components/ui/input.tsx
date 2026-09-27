import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-white/10 bg-[#181826] px-3.5 py-2 text-sm text-white placeholder:text-[#9a9aa8]/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)] transition-all outline-none focus-visible:border-[#58cc02] focus-visible:shadow-[0_0_0_3px_rgba(88,204,2,0.25),inset_0_1px_2px_rgba(0,0,0,0.2)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
