import { useCallback } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import {
  CATEGORIES,
  PERSONAS,
  ISSUE_TYPE_GROUPS,
  PRIORITIES,
  DOC_WEIGHT_MIN,
  DOC_WEIGHT_MAX,
  DOC_WEIGHT_STEP,
  type DocumentFilters,
  type IssueType,
  formatCategory,
  formatPersona,
  formatPriority,
  formatIssueType,
} from '@/utils/filters';

interface FilterFormProps {
  filters: DocumentFilters;
  onChange: (filters: DocumentFilters) => void;
  errors?: Partial<Record<keyof DocumentFilters, string>>;
}

const initialFilters: DocumentFilters = {
  category: '' as any,
  persona: [],
  issue_type: [],
  priority: '' as any,
  doc_weight: 1.0,
};

export function FilterForm({ filters, onChange, errors }: FilterFormProps) {
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({
        ...filters,
        category: e.target.value as DocumentFilters['category'],
      });
    },
    [filters, onChange]
  );

  const handlePersonaChange = useCallback(
    (value: string[]) => {
      onChange({
        ...filters,
        persona: value as DocumentFilters['persona'],
      });
    },
    [filters, onChange]
  );

  const handleIssueTypeChange = useCallback(
    (value: string[]) => {
      onChange({
        ...filters,
        issue_type: value as DocumentFilters['issue_type'],
      });
    },
    [filters, onChange]
  );

  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({
        ...filters,
        priority: e.target.value as DocumentFilters['priority'],
      });
    },
    [filters, onChange]
  );

  const handleDocWeightChange = useCallback(
    (value: number) => {
      onChange({
        ...filters,
        doc_weight: value,
      });
    },
    [filters, onChange]
  );

  const handleReset = useCallback(() => {
    onChange(initialFilters);
  }, [onChange]);

  // Prepare category options
  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: formatCategory(cat),
  }));

  // Prepare persona options
  const personaOptions = PERSONAS.map((p) => ({
    value: p,
    label: formatPersona(p),
  }));

  // Prepare issue type options with groups
  const issueTypeOptions = Object.entries(ISSUE_TYPE_GROUPS).flatMap(
    ([groupName, types]) =>
      types.map((type) => ({
        value: type,
        label: formatIssueType(type as IssueType),
        group: groupName,
      }))
  );

  // Prepare priority options
  const priorityOptions = PRIORITIES.map((p) => ({
    value: p,
    label: formatPriority(p),
  }));

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900">Filters</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 px-2 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Filter Fields - 2-column grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Category - Row 1, Col 1 */}
        <Select
          label="Category"
          required
          value={filters.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          error={errors?.category}
          helpText="Select the document category"
        />

        {/* Priority - Row 1, Col 2 */}
        <Select
          label="Priority"
          required
          value={filters.priority}
          onChange={handlePriorityChange}
          options={priorityOptions}
          error={errors?.priority}
          helpText="Select the priority level for this document"
        />

        {/* Persona - Row 2, Col 1 */}
        <MultiSelect
          label="Persona"
          required
          value={filters.persona}
          onChange={handlePersonaChange}
          options={personaOptions}
          error={errors?.persona}
          helpText="Select at least one persona this document applies to"
          placeholder="Select personas"
        />

        {/* Issue Type - Row 2, Col 2 */}
        <MultiSelect
          label="Issue Type"
          required
          value={filters.issue_type}
          onChange={handleIssueTypeChange}
          options={issueTypeOptions}
          error={errors?.issue_type}
          helpText="Select one or more issue types this document addresses"
          placeholder="Select issue types"
        />

        {/* Doc Weight - Row 3, spans both columns */}
        <div className="col-span-1 sm:col-span-2">
          <Slider
            label="Document Weight"
            required
            min={DOC_WEIGHT_MIN}
            max={DOC_WEIGHT_MAX}
            step={DOC_WEIGHT_STEP}
            value={filters.doc_weight}
            onChange={handleDocWeightChange}
            error={errors?.doc_weight}
            helpText={`Range: ${DOC_WEIGHT_MIN} (low) to ${DOC_WEIGHT_MAX} (high)`}
            showValue
          />
        </div>
      </div>
    </div>
  );
}
