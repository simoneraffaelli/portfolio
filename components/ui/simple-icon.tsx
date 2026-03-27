import { cn } from "@/lib/utils"

type SimpleIconData = {
  path: string
}

type SimpleIconProps = React.SVGProps<SVGSVGElement> & {
  icon: SimpleIconData
  title?: string
}

export function SimpleIcon({ icon, className, title, ...props }: SimpleIconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      role={title ? "img" : undefined}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={icon.path} />
    </svg>
  )
}