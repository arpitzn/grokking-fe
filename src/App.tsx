import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout';
import { ErrorBoundary, ToastContainer, toast } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

function App() {
  const error = useAppStore(state => state.error);
  const clearError = useAppStore(state => state.clearError);
  const loadPersonaFromStorage = useAppStore(state => state.loadPersonaFromStorage);
  const resolveUserByPersona = useAppStore(state => state.resolveUserByPersona);
  const isResolvingUser = useAppStore(state => state.isResolvingUser);

  // Initialize persona and resolve user on app load (only once)
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // Clear old format if exists (migration)
      try {
        localStorage.removeItem('personaUserIdMap');
      } catch {
        // Ignore localStorage errors
      }
      
      // Clear persona_user_map on page refresh
      try {
        localStorage.removeItem('persona_user_map');
      } catch {
        // Ignore localStorage errors
      }
      
      // Load persona from localStorage (defaults to area_manager if not found)
      loadPersonaFromStorage();
      
      // Resolve user by persona (happens before UI renders)
      if (isMounted) {
        await resolveUserByPersona();
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

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

  // Show loading state while resolving user
  if (isResolvingUser) {
    return (
      <ErrorBoundary>
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading...</p>
          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppLayout />
      <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />
    </ErrorBoundary>
  );
}

export default App;
