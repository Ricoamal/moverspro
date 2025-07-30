import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActions = [
    { value: '', label: 'Select action...' },
    { value: 'sendReminder', label: 'Send Payment Reminders' },
    { value: 'markPaid', label: 'Mark as Paid' },
    { value: 'markOverdue', label: 'Mark as Overdue' },
    { value: 'export', label: 'Export to PDF' },
    { value: 'exportExcel', label: 'Export to Excel' },
    { value: 'delete', label: 'Delete Invoices' }
  ];

  const handleExecuteAction = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 lg:left-80 lg:transform-none">
      <div className="bg-white rounded-lg shadow-modal border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {selectedCount} invoice{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Action Selector */}
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Choose action"
              className="min-w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              onClick={handleExecuteAction}
              disabled={!selectedAction}
              iconName="Play"
              iconPosition="left"
            >
              Execute
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('sendReminder')}
              iconName="Mail"
              iconPosition="left"
            >
              Send Reminders
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('export')}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-gray-600 transition-smooth"
            title="Clear selection"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Action Descriptions */}
        {selectedAction && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              {selectedAction === 'sendReminder' && 'Send payment reminder emails to selected customers'}
              {selectedAction === 'markPaid' && 'Mark selected invoices as fully paid'}
              {selectedAction === 'markOverdue' && 'Mark selected invoices as overdue'}
              {selectedAction === 'export' && 'Export selected invoices to PDF format'}
              {selectedAction === 'exportExcel' && 'Export selected invoices to Excel spreadsheet'}
              {selectedAction === 'delete' && 'Permanently delete selected invoices (cannot be undone)'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionsBar;