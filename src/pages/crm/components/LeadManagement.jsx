import React, { useState } from 'react';
import { useCRM } from '../../../contexts/CRMContext';
import { LeadSources, LeadStatus } from '../../../types/crm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LeadManagement = ({ onCreateLead, onViewLead, onConvertLead }) => {
  const {
    leads,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPagination,
    updateLead,
    clearError
  } = useCRM();

  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setFilters('leads', { search: query });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters('leads', { [filterName]: value });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination('leads', { page: newPage });
  };

  // Handle lead selection
  const handleLeadSelect = (lead) => {
    if (onViewLead) {
      onViewLead(lead);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (leadId, newStatus) => {
    const result = await updateLead(leadId, { status: newStatus });
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'text-blue-600 bg-blue-100';
      case LeadStatus.CONTACTED:
        return 'text-yellow-600 bg-yellow-100';
      case LeadStatus.QUALIFIED:
        return 'text-green-600 bg-green-100';
      case LeadStatus.PROPOSAL_SENT:
        return 'text-purple-600 bg-purple-100';
      case LeadStatus.NEGOTIATION:
        return 'text-orange-600 bg-orange-100';
      case LeadStatus.CONVERTED:
        return 'text-green-600 bg-green-100';
      case LeadStatus.LOST:
        return 'text-red-600 bg-red-100';
      case LeadStatus.NURTURING:
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get rating color
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'hot':
        return 'text-red-600 bg-red-100';
      case 'warm':
        return 'text-yellow-600 bg-yellow-100';
      case 'cold':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format status text
  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Lead source options
  const sourceOptions = Object.values(LeadSources).map(source => ({
    value: source,
    label: source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Lead status options
  const statusOptions = Object.values(LeadStatus).map(status => ({
    value: status,
    label: formatStatus(status)
  }));

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Leads</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and track all your sales leads
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => {
              // Export leads functionality
              alert('Lead export will be implemented');
            }}
          >
            Export
          </Button>
          <Button
            iconName="UserPlus"
            onClick={onCreateLead}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search leads..."
              value={filters.leads.search}
              onChange={handleSearch}
              iconName="Search"
            />
          </div>
          <Button
            variant="outline"
            iconName="Filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Status"
              options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
              value={filters.leads.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Source"
              options={[{ value: '', label: 'All Sources' }, ...sourceOptions]}
              value={filters.leads.source}
              onChange={(value) => handleFilterChange('source', value)}
            />
            
            <Select
              label="Rating"
              options={[
                { value: '', label: 'All Ratings' },
                { value: 'hot', label: 'Hot' },
                { value: 'warm', label: 'Warm' },
                { value: 'cold', label: 'Cold' }
              ]}
              value={filters.leads.rating}
              onChange={(value) => handleFilterChange('rating', value)}
            />
            
            <Select
              label="Sort By"
              options={[
                { value: 'createdAt', label: 'Created Date' },
                { value: 'updatedAt', label: 'Updated Date' },
                { value: 'score', label: 'Lead Score' },
                { value: 'estimatedValue', label: 'Estimated Value' }
              ]}
              value={filters.leads.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
            
            <Select
              label="Sort Order"
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' }
              ]}
              value={filters.leads.sortOrder}
              onChange={(value) => handleFilterChange('sortOrder', value)}
            />
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-600">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No leads found</h3>
                      <p className="text-sm">Get started by creating your first lead.</p>
                      <Button
                        className="mt-4"
                        iconName="UserPlus"
                        onClick={onCreateLead}
                      >
                        Create Lead
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleLeadSelect(lead)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{lead.title || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {formatStatus(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(lead.rating)}`}>
                        {lead.rating.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{lead.score}</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.estimatedValue > 0 ? formatCurrency(lead.estimatedValue) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadSelect(lead);
                          }}
                        />
                        
                        {lead.status === LeadStatus.QUALIFIED && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="ArrowRight"
                            onClick={(e) => {
                              e.stopPropagation();
                              onConvertLead(lead);
                            }}
                            className="text-green-600 hover:text-green-700"
                          />
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="MoreHorizontal"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show more options menu
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.leads.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.leads.page - 1)}
                disabled={!pagination.leads.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.leads.page + 1)}
                disabled={!pagination.leads.hasNext}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.leads.page - 1) * pagination.leads.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.leads.page * pagination.leads.limit, pagination.leads.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.leads.total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.leads.page - 1)}
                    disabled={!pagination.leads.hasPrev}
                    className="rounded-l-md"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: pagination.leads.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.leads.totalPages || 
                      Math.abs(page - pagination.leads.page) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <Button
                          variant={page === pagination.leads.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="border-l-0"
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.leads.page + 1)}
                    disabled={!pagination.leads.hasNext}
                    className="rounded-r-md border-l-0"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;
