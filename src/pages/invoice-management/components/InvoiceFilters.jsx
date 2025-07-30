import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const InvoiceFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partially Paid' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Invoices</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="xl:col-span-2">
          <Input
            type="search"
            placeholder="Search invoices, customers..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select
          placeholder="Payment Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Date From */}
        <Input
          type="date"
          placeholder="From Date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="To Date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />

        {/* Amount Range */}
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min KES"
            value={filters.amountMin}
            onChange={(e) => handleFilterChange('amountMin', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max KES"
            value={filters.amountMax}
            onChange={(e) => handleFilterChange('amountMax', e.target.value)}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.search && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            Search: {filters.search}
            <button
              onClick={() => handleFilterChange('search', '')}
              className="ml-2 hover:text-blue-600"
            >
              <Icon name="X" size={14} />
            </button>
          </span>
        )}
        {filters.status && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
            <button
              onClick={() => handleFilterChange('status', '')}
              className="ml-2 hover:text-green-600"
            >
              <Icon name="X" size={14} />
            </button>
          </span>
        )}
        {(filters.dateFrom || filters.dateTo) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Date Range: {filters.dateFrom || 'Start'} - {filters.dateTo || 'End'}
            <button
              onClick={() => {
                handleFilterChange('dateFrom', '');
                handleFilterChange('dateTo', '');
              }}
              className="ml-2 hover:text-purple-600"
            >
              <Icon name="X" size={14} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default InvoiceFilters;