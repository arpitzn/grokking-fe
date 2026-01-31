import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded',
        className
      )}
      aria-hidden="true"
    />
  );
}

// Preset skeleton components for common use cases

export function SkeletonMessage({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        <Skeleton className="h-4 w-20" />
        <Skeleton className={cn('h-16 rounded-2xl', isUser ? 'w-48' : 'w-64')} />
      </div>
    </div>
  );
}

export function SkeletonThread() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonDocument() {
  return (
    <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl">
      <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
