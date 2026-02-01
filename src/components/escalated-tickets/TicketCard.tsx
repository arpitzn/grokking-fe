import { cn } from '@/utils/cn';
import { formatThreadDate } from '@/utils/formatters';
import type { EscalatedTicket } from '@/types';

interface TicketCardProps {
  ticket: EscalatedTicket;
  onClick?: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  // Color coding based on severity
  const severityConfig = {
    1: {
      label: 'Critical',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-800',
    },
    2: {
      label: 'High',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
    },
  };

  const config = severityConfig[ticket.severity];

  // Status badge colors
  const statusColors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer',
        'hover:shadow-lg hover:-translate-y-0.5',
        config.borderColor,
        config.bgColor
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Header with title and severity */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-zinc-900 flex-1 pr-2">
          {ticket.title}
        </h3>
        <span
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap',
            config.badgeBg,
            config.badgeText
          )}
        >
          {config.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-700 mb-4 line-clamp-none whitespace-pre-wrap">
        {ticket.description}
      </p>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Status badge */}
        <span
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium capitalize',
            statusColors[ticket.status] || statusColors.open
          )}
        >
          {ticket.status}
        </span>

        {/* Issue type */}
        {ticket.issue_type && (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 capitalize">
            {ticket.issue_type.replace(/_/g, ' ')}
          </span>
        )}

        {/* Created date */}
        <span className="text-xs text-zinc-500">
          {formatThreadDate(ticket.created_at)}
        </span>
      </div>

      {/* Additional info */}
      {ticket.scope && (
        <div className="text-xs text-zinc-500 mt-2">
          Scope: <span className="font-medium capitalize">{ticket.scope}</span>
        </div>
      )}
    </div>
  );
}
