import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ selectedQuotes, onBulkAction, onSelectAll, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'approve', label: 'Approve Selected' },
    { value: 'reject', label: 'Reject Selected' },
    { value: 'revision', label: 'Request Revision' },
    { value: 'export', label: 'Export to CSV' },
    { value: 'email', label: 'Send Email Updates' }
  ];

  const handleBulkAction = () => {
    if (bulkAction && selectedQuotes.length > 0) {
      onBulkAction(bulkAction, selectedQuotes);
      setBulkAction('');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'approve':
        return 'Check';
      case 'reject':
        return 'X';
      case 'revision':
        return 'Edit';
      case 'export':
        return 'Download';
      case 'email':
        return 'Mail';
      default:
        return 'Settings';
    }
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'approve':
        return 'success';
      case 'reject':
        return 'destructive';
      case 'revision':
        return 'outline';
      case 'export':
        return 'secondary';
      case 'email':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (selectedQuotes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Checkbox
              checked={selectedQuotes.length > 0}
              indeterminate={selectedQuotes.length > 0}
              onChange={onSelectAll}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-900">
              {selectedQuotes.length} quote{selectedQuotes.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear Selection
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-3">
          <div className="w-48">
            <Select
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Select action..."
            />
          </div>
          
          <Button
            variant={getActionVariant(bulkAction)}
            onClick={handleBulkAction}
            disabled={!bulkAction}
            iconName={getActionIcon(bulkAction)}
            iconPosition="left"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="success"
          size="sm"
          onClick={() => onBulkAction('approve', selectedQuotes)}
          iconName="Check"
          iconPosition="left"
        >
          Approve All ({selectedQuotes.length})
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onBulkAction('reject', selectedQuotes)}
          iconName="X"
          iconPosition="left"
        >
          Reject All ({selectedQuotes.length})
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('revision', selectedQuotes)}
          iconName="Edit"
          iconPosition="left"
        >
          Request Revision ({selectedQuotes.length})
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBulkAction('export', selectedQuotes)}
          iconName="Download"
          iconPosition="left"
        >
          Export Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;