import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-display font-bold tracking-wide whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-[#58cc02] text-white hover:brightness-105 shadow-[0_4px_0_#46a302,0_8px_20px_-4px_rgba(88,204,2,0.45)] hover:shadow-[0_5px_0_#46a302,0_10px_24px_-4px_rgba(88,204,2,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunky:
          "rounded-xl bg-[#58cc02] text-white hover:brightness-105 shadow-[0_4px_0_#46a302,0_8px_20px_-4px_rgba(88,204,2,0.45)] hover:shadow-[0_5px_0_#46a302,0_10px_24px_-4px_rgba(88,204,2,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunkyOutline:
          "rounded-xl bg-[#14141f] text-[#f5f5f7] border border-white/10 hover:bg-[#181826] shadow-[0_4px_0_rgba(255,255,255,0.08),0_8px_20px_-4px_rgba(0,0,0,0.7)] hover:shadow-[0_5px_0_rgba(255,255,255,0.12),0_10px_24px_-4px_rgba(0,0,0,0.8)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunkyBlue:
          "rounded-xl bg-[#1cb0f6] text-white hover:brightness-105 shadow-[0_4px_0_#1793ce,0_8px_20px_-4px_rgba(28,176,246,0.45)] hover:shadow-[0_5px_0_#1793ce,0_10px_24px_-4px_rgba(28,176,246,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunkyPurple:
          "rounded-xl bg-[#ce82ff] text-white hover:brightness-105 shadow-[0_4px_0_#ab60dc,0_8px_20px_-4px_rgba(206,130,255,0.45)] hover:shadow-[0_5px_0_#ab60dc,0_10px_24px_-4px_rgba(206,130,255,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunkyOrange:
          "rounded-xl bg-[#ff9600] text-white hover:brightness-105 shadow-[0_4px_0_#d47c00,0_8px_20px_-4px_rgba(255,150,0,0.45)] hover:shadow-[0_5px_0_#d47c00,0_10px_24px_-4px_rgba(255,150,0,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        chunkyRed:
          "rounded-xl bg-[#ff4b4b] text-white hover:brightness-105 shadow-[0_4px_0_#d83a3a,0_8px_20px_-4px_rgba(255,75,75,0.45)] hover:shadow-[0_5px_0_#d83a3a,0_10px_24px_-4px_rgba(255,75,75,0.55)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none transition-all duration-75",
        outline:
          "rounded-xl border border-white/10 bg-[#14141f] text-[#f5f5f7] hover:bg-[#181826] hover:text-white transition-colors",
        secondary:
          "rounded-xl bg-[#181826] text-[#f5f5f7] hover:bg-white/10 transition-colors",
        ghost:
          "rounded-xl hover:bg-white/5 text-[#9a9aa8] hover:text-white transition-colors",
        link: "text-[#58cc02] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5 text-sm",
        sm: "h-9 gap-1.5 px-3.5 text-xs",
        lg: "h-13 gap-2 px-8 text-base",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "chunky",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "chunky",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
