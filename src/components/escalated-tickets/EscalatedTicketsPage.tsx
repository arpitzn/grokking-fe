import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { TicketCard } from './TicketCard';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

export function EscalatedTicketsPage() {
  const escalatedTickets = useAppStore(state => state.escalatedTickets);
  const fetchEscalatedTickets = useAppStore(state => state.fetchEscalatedTickets);
  const setCurrentView = useAppStore(state => state.setCurrentView);
  const selectedPersona = useAppStore(state => state.selectedPersona);
  const userId = useAppStore(state => state.userId);
  const isResolvingUser = useAppStore(state => state.isResolvingUser);

  // Fetch tickets on mount and when persona/user changes
  useEffect(() => {
    // Skip fetch for End Customer, if resolving, or if no userId
    if (selectedPersona.persona === 'end_customer' || isResolvingUser || !userId) {
      return;
    }

    // Only fetch for Area Manager and Customer Care Rep
    if (selectedPersona.persona === 'area_manager' || selectedPersona.persona === 'customer_care_rep') {
      fetchEscalatedTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPersona.persona, userId, isResolvingUser]);

  const handleRefresh = () => {
    fetchEscalatedTickets();
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToChat}
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
            aria-label="Back to chat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-zinc-900">Escalated Tickets</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          aria-label="Refresh tickets"
          title="Refresh"
          className="h-9 w-9"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {escalatedTickets.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {escalatedTickets.map(ticket => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                onClick={() => {
                  // Prepare for future drill-down - no action yet
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
