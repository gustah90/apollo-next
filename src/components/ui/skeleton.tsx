import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-accent animate-pulse rounded-md',
        'animate-pulse rounded-md bg-slate-900',
        //'animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
