import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Ghoroa primary — terracotta fill + cream (AA on solid red)
        default:
          "rounded-none border border-terracotta bg-terracotta text-cream hover:bg-terracotta-deep hover:text-cream",
        // Ghoroa secondary — red outline, fill on hover
        secondary:
          "rounded-none border border-gold-deep/70 bg-transparent text-gold hover:bg-terracotta hover:text-cream",
        outline:
          "rounded-none border border-gold-deep/70 bg-transparent text-gold hover:bg-terracotta hover:text-cream",
        ghost:
          "rounded-none hover:bg-terracotta/15 hover:text-gold aria-expanded:bg-terracotta/15 aria-expanded:text-gold",
        destructive:
          "rounded-none bg-terracotta-deep/20 text-gold hover:bg-terracotta-deep/35 focus-visible:border-terracotta/40 focus-visible:ring-terracotta/20",
        link: "text-gold underline-offset-4 hover:underline",
        // aliases kept for existing callers
        primary:
          "rounded-none border border-terracotta bg-terracotta text-cream hover:bg-terracotta-deep hover:text-cream",
        gold:
          "rounded-none border border-gold-deep/70 bg-transparent text-gold hover:bg-terracotta hover:text-cream",
        goldSolid:
          "rounded-none border border-terracotta bg-terracotta text-cream hover:bg-terracotta-deep hover:text-cream",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        cta: "h-auto gap-2.5 rounded-none px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
