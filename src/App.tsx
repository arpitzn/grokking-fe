import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout';
import { ErrorBoundary, ToastContainer, toast } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

function App() {
  const error = useAppStore(state => state.error);
  const clearError = useAppStore(state => state.clearError);

  // Toast state
  interface ToastItem {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Subscribe to toast notifications
  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  // Show toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleRemoveToast = (id: string) => {
    toast.remove(id);
  };

  return (
    <ErrorBoundary>
      <AppLayout />
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </ErrorBoundary>
  );
}

export default App;
