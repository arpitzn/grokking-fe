import { useEffect } from 'react';
import { Panel } from '@/components/ui';
import { FileUploader } from './FileUploader';
import { DocumentList } from './DocumentList';
import { useAppStore } from '@/store/appStore';
import type { DocumentFilters } from '@/utils/filters';

export function KnowledgePanel() {
  const isOpen = useAppStore(state => state.isKnowledgePanelOpen);
  const documents = useAppStore(state => state.documents);
  const isUploading = useAppStore(state => state.isUploadingDocument);

  const togglePanel = useAppStore(state => state.toggleKnowledgePanel);
  const fetchDocuments = useAppStore(state => state.fetchDocuments);
  const uploadDocuments = useAppStore(state => state.uploadDocuments);

  // Fetch documents when panel opens (only if data is stale)
  useEffect(() => {
    if (isOpen) {
      const { documentsLastFetched } = useAppStore.getState();
      const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

      const isStale =
        !documentsLastFetched ||
        Date.now() - documentsLastFetched > STALE_THRESHOLD_MS;

      if (isStale) {
        fetchDocuments();
      }
    }
  }, [isOpen, fetchDocuments]);

  const handleUpload = async (files: File[], filters: DocumentFilters) => {
    if (files.length === 0) return;

    try {
      await uploadDocuments(files, filters);
    } catch (err) {
      // Error already handled in store
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={togglePanel}
      title="Knowledge Base"
    >
      <div className="space-y-6">
        {/* Upload section */}
        <div>
          <h3 className="text-sm font-medium text-zinc-700 mb-3">
            Upload Document
          </h3>
          <FileUploader onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {/* Divider */}
        <hr className="border-zinc-200" />

        {/* Document list */}
        <DocumentList documents={documents} />
      </div>
    </Panel>
  );
}
