import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
};

export function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setIsVisible(true);

    // Auto-dismiss (except for errors)
    if (type !== 'error' && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, type, duration, onClose]);

  const Icon = icons[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 200);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 border rounded-xl shadow-lg max-w-sm',
        'transition-all duration-200',
        styles[type],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', iconStyles[type])} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="h-6 w-6 -mr-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Toast container and manager
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
}

// Simple toast hook for convenience
let toastId = 0;
const toastListeners = new Set<(toasts: ToastItem[]) => void>();
let toastList: ToastItem[] = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toastList]));
};

export const toast = {
  success: (message: string, duration?: number) => {
    const id = `toast-${++toastId}`;
    toastList.push({ id, type: 'success', message, duration });
    notifyListeners();
    return id;
  },
  error: (message: string, duration?: number) => {
    const id = `toast-${++toastId}`;
    toastList.push({ id, type: 'error', message, duration });
    notifyListeners();
    return id;
  },
  warning: (message: string, duration?: number) => {
    const id = `toast-${++toastId}`;
    toastList.push({ id, type: 'warning', message, duration });
    notifyListeners();
    return id;
  },
  info: (message: string, duration?: number) => {
    const id = `toast-${++toastId}`;
    toastList.push({ id, type: 'info', message, duration });
    notifyListeners();
    return id;
  },
  remove: (id: string) => {
    toastList = toastList.filter(t => t.id !== id);
    notifyListeners();
  },
  subscribe: (listener: (toasts: ToastItem[]) => void) => {
    toastListeners.add(listener);
    listener([...toastList]);
    return () => toastListeners.delete(listener);
  },
};
