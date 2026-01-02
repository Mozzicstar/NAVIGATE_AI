import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  details?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirming?: boolean;
};

const AgentConfirmModal: React.FC<Props> = ({ open, title, description, details, onCancel, onConfirm, confirmLabel = 'Confirm & queue', confirming = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 z-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              {title || 'Agent Action'}
            </h3>
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          <button onClick={onCancel} aria-label="Close" className="p-2 rounded hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {details && <pre className="mt-4 p-3 bg-gray-50 text-sm rounded text-gray-700 overflow-auto">{details}</pre>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button onClick={onConfirm} disabled={confirming} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">
            {confirming ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentConfirmModal;
