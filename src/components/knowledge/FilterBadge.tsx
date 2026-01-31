import {
  formatCategory,
  formatPersona,
  formatIssueType,
  formatPriority,
  type Category,
  type Persona,
  type IssueType,
  type Priority,
} from '@/utils/filters';
import { Tooltip } from '@/components/ui';

interface FilterBadgeProps {
  type: 'category' | 'persona' | 'issue_type' | 'priority' | 'doc_weight';
  value: string;
}

const badgeColors = {
  category: 'bg-blue-100 text-blue-700 border-blue-200',
  persona: 'bg-green-100 text-green-700 border-green-200',
  issue_type: 'bg-purple-100 text-purple-700 border-purple-200',
  priority: 'bg-orange-100 text-orange-700 border-orange-200',
  doc_weight: 'bg-gray-100 text-gray-700 border-gray-200',
};

const filterTypeLabels = {
  category: 'Category',
  persona: 'Persona',
  issue_type: 'Issue Type',
  priority: 'Priority',
  doc_weight: 'Document Weight',
};

export function FilterBadge({ type, value }: FilterBadgeProps) {
  const formatValue = () => {
    switch (type) {
      case 'category':
        return formatCategory(value as Category);
      case 'persona':
        return formatPersona(value as Persona);
      case 'issue_type':
        return formatIssueType(value as IssueType);
      case 'priority':
        return formatPriority(value as Priority);
      case 'doc_weight':
        return `Weight: ${value}`;
      default:
        return value;
    }
  };

  return (
    <Tooltip
      filterType={filterTypeLabels[type]}
      filterValue={formatValue()}
      badgeType={type}
    >
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${badgeColors[type]}`}>
        {formatValue()}
      </span>
    </Tooltip>
  );
}
