import { useState } from 'react';
import { FileText, Database, Trash2 } from 'lucide-react';
import { SkeletonDocument, Button, ConfirmDialog } from '@/components/ui';
import { formatRelativeTime } from '@/utils/formatters';
import { FilterBadge } from './FilterBadge';
import { useAppStore } from '@/store/appStore';
import type { Document } from '@/types';

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
}

export function DocumentList({ documents, isLoading = false }: DocumentListProps) {
  const [confirmDeleteFileId, setConfirmDeleteFileId] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  
  const isDeletingDocument = useAppStore(state => state.isDeletingDocument);
  const deleteDocument = useAppStore(state => state.deleteDocument);
  const deleteAllDocuments = useAppStore(state => state.deleteAllDocuments);

  const handleDeleteFile = async () => {
    if (confirmDeleteFileId) {
      await deleteDocument(confirmDeleteFileId);
      setConfirmDeleteFileId(null);
    }
  };

  const handleDeleteAll = async () => {
    await deleteAllDocuments();
    setConfirmDeleteAll(false);
  };
  if (isLoading) {
    return (
      <div className="space-y-3">
        <SkeletonDocument />
        <SkeletonDocument />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
          <Database className="w-6 h-6 text-zinc-400" />
        </div>
        <p className="text-sm text-zinc-500">No documents uploaded yet</p>
        <p className="text-xs text-zinc-400 mt-1">
          Upload documents to enable RAG search
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700">
            Uploaded Documents ({documents.length})
          </h3>
          {documents.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDeleteAll(true)}
              disabled={isDeletingDocument}
              className="h-7 px-2 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete All
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin space-y-2">
          {documents.map(doc => (
            <div
              key={doc.document_id}
              className="relative flex flex-col gap-2 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {doc.filename}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border bg-zinc-100 text-zinc-700 border-zinc-200">
                      {doc.chunk_count} chunk{doc.chunk_count !== 1 ? 's' : ''}
                    </span>
                    {doc.created_at && (
                      <>
                        <span className="text-zinc-300">·</span>
                        <span className="text-xs text-zinc-400">
                          {formatRelativeTime(doc.created_at)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmDeleteFileId(doc.file_id)}
                  disabled={isDeletingDocument}
                  className="h-7 w-7 flex-shrink-0 hover:text-red-600"
                  aria-label={`Delete ${doc.filename}`}
                >
                  <Trash2 className="w-4 h-4 text-zinc-700 hover:text-red-600 transition-colors" />
                </Button>
              </div>

              {/* Filter badges */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {doc.category && (
                  <FilterBadge type="category" value={doc.category} />
                )}
                {doc.persona && doc.persona.map(p => (
                  <FilterBadge key={p} type="persona" value={p} />
                ))}
                {doc.issue_type && doc.issue_type.map(it => (
                  <FilterBadge key={it} type="issue_type" value={it} />
                ))}
                {doc.priority && (
                  <FilterBadge type="priority" value={doc.priority} />
                )}
                {doc.doc_weight && (
                  <FilterBadge type="doc_weight" value={doc.doc_weight.toString()} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation dialogs */}
      <ConfirmDialog
        isOpen={confirmDeleteFileId !== null}
        onClose={() => setConfirmDeleteFileId(null)}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message={`Are you sure you want to delete "${documents.find(d => d.file_id === confirmDeleteFileId)?.filename}"?`}
        variant="danger"
        isLoading={isDeletingDocument}
      />

      <ConfirmDialog
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Files"
        message={`Delete all ${documents.length} uploaded files? This cannot be undone.`}
        variant="danger"
        isLoading={isDeletingDocument}
      />
    </>
  );
}
