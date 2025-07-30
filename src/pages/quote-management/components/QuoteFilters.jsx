import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const QuoteFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'revision', label: 'Needs Revision' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'value_high', label: 'Highest Value' },
    { value: 'value_low', label: 'Lowest Value' },
    { value: 'service_date', label: 'Service Date' }
  ];

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.urgency !== 'all' || 
                          filters.search !== '' ||
                          filters.dateRange.start !== '' ||
                          filters.dateRange.end !== '';

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by customer name, quote ID, or location..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => onFilterChange('sortBy', value)}
            placeholder="Sort by..."
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Priority"
          options={urgencyOptions}
          value={filters.urgency}
          onChange={(value) => onFilterChange('urgency', value)}
        />

        <Input
          label="From Date"
          type="date"
          value={filters.dateRange.start}
          onChange={(e) => onFilterChange('dateRange', { 
            ...filters.dateRange, 
            start: e.target.value 
          })}
        />

        <Input
          label="To Date"
          type="date"
          value={filters.dateRange.end}
          onChange={(e) => onFilterChange('dateRange', { 
            ...filters.dateRange, 
            end: e.target.value 
          })}
        />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-gray-600">
          Showing filtered results
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuoteFilters;