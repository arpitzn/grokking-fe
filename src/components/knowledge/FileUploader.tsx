import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import { formatFileSize } from '@/utils/formatters';
import { FilterForm } from './FilterForm';
import { DOC_WEIGHT_MIN, DOC_WEIGHT_MAX, type DocumentFilters } from '@/utils/filters';

interface FileUploaderProps {
  onUpload: (files: File[], filters: DocumentFilters) => Promise<void>;
  isUploading: boolean;
  acceptedTypes?: string[];
}

const DEFAULT_ACCEPTED_TYPES = [
  '.txt',
  '.md',
  '.pdf',
  '.doc',
  '.docx',
  '.png',
  '.jpg',
  '.jpeg',
  '.html',
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const initialFilters: DocumentFilters = {
  category: '' as any,
  persona: [],
  issue_type: [],
  priority: '' as any,
  doc_weight: 1.0,
};

export function FileUploader({
  onUpload,
  isUploading,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentFilters>(initialFilters);
  const [filterErrors, setFilterErrors] = useState<
    Partial<Record<keyof DocumentFilters, string>>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Check file size (max 50MB)
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];

    files.forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    // Reset input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      'pdf': 'PDF',
      'doc': 'DOC',
      'docx': 'DOCX',
      'txt': 'TXT',
      'md': 'Markdown',
      'png': 'PNG',
      'jpg': 'JPG',
      'jpeg': 'JPEG',
      'html': 'HTML',
    };
    return typeMap[ext] || ext.toUpperCase();
  };

  const validateFilters = (): boolean => {
    const errors: Partial<Record<keyof DocumentFilters, string>> = {};

    if (!filters.category) {
      errors.category = 'Category is required';
    }
    if (filters.persona.length === 0) {
      errors.persona = 'At least one persona is required';
    }
    if (filters.issue_type.length === 0) {
      errors.issue_type = 'At least one issue type is required';
    }
    if (!filters.priority) {
      errors.priority = 'Priority is required';
    }
    if (
      filters.doc_weight < DOC_WEIGHT_MIN ||
      filters.doc_weight > DOC_WEIGHT_MAX
    ) {
      errors.doc_weight = `Document weight must be between ${DOC_WEIGHT_MIN} and ${DOC_WEIGHT_MAX}`;
    }

    setFilterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    // Validate filters before upload
    if (!validateFilters()) {
      setError('Please complete all required filters');
      return;
    }

    try {
      await onUpload(selectedFiles, filters);
      setSelectedFiles([]);
      setError(null);
      setFilters(initialFilters);
      setFilterErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setError(null);
    setFilters(initialFilters);
    setFilterErrors({});
  };

  const isFiltersValid = (): boolean => {
    if (selectedFiles.length === 0) return false;
    return (
      !!filters.category &&
      filters.persona.length > 0 &&
      filters.issue_type.length > 0 &&
      !!filters.priority &&
      filters.doc_weight >= DOC_WEIGHT_MIN &&
      filters.doc_weight <= DOC_WEIGHT_MAX
    );
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer',
          'transition-all duration-150',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50',
          isUploading && 'pointer-events-none opacity-50'
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
          multiple={true}
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              isDragging ? 'bg-blue-100' : 'bg-zinc-100'
            )}
          >
            <Upload
              className={cn(
                'w-6 h-6',
                isDragging ? 'text-blue-600' : 'text-zinc-500'
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supported: {acceptedTypes.join(', ')} (max {formatFileSize(MAX_FILE_SIZE)})
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files Container */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-700">
              Selected Files ({selectedFiles.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 px-2 text-xs"
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>
          <div className="h-[180px] overflow-y-auto border border-zinc-200 rounded-lg p-2 space-y-1.5 scrollbar-thin">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatFileSize(file.size)} · {getFileType(file.name)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  disabled={isUploading}
                  className="h-7 w-7 p-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Form - appears after file selection */}
      {selectedFiles.length > 0 && (
        <div className="pt-4 border-t border-zinc-200">
          <FilterForm
            filters={filters}
            onChange={setFilters}
            errors={filterErrors}
          />
          
          {/* Upload button - below filters */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={selectedFiles.length === 0 || !isFiltersValid() || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
