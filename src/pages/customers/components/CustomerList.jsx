import React, { useState } from 'react';
import { useCustomers } from '../../../contexts/CustomerContext';
import { CustomerStatus, CustomerTypes } from '../../../types/customer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CustomerList = ({ onCustomerSelect, onCreateCustomer }) => {
  const {
    customers,
    loading,
    error,
    filters,
    pagination,
    customerStats,
    setFilters,
    setPagination,
    searchCustomers,
    deleteCustomer,
    exportCustomers,
    clearError
  } = useCustomers();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setFilters({ search: query });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ page: newPage });
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        alert('Customer deleted successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  // Handle bulk selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  // Handle export
  const handleExport = async (format) => {
    const result = await exportCustomers(format);
    if (!result.success) {
      alert(`Export failed: ${result.error}`);
    }
  };

  // Format customer data for display
  const formatCustomerName = (customer) => {
    return `${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`;
  };

  const formatCustomerType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case CustomerStatus.INACTIVE:
        return 'text-gray-600 bg-gray-100';
      case CustomerStatus.SUSPENDED:
        return 'text-red-600 bg-red-100';
      case CustomerStatus.PROSPECT:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum':
        return 'text-purple-600 bg-purple-100';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'silver':
        return 'text-gray-600 bg-gray-100';
      case 'bronze':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Customers</h3>
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
      {/* Header with Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              onClick={() => handleExport('json')}
            >
              Export JSON
            </Button>
            <Button
              iconName="Plus"
              onClick={onCreateCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{customerStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{customerStats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{customerStats.inactive}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{customerStats.prospects}</div>
            <div className="text-sm text-gray-600">Prospects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{customerStats.vip}</div>
            <div className="text-sm text-gray-600">VIP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{customerStats.corporate}</div>
            <div className="text-sm text-gray-600">Corporate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{customerStats.individual}</div>
            <div className="text-sm text-gray-600">Individual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              KSh {customerStats.averageLifetimeValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avg LTV</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search customers..."
              value={filters.search}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Status"
              options={[
                { value: '', label: 'All Statuses' },
                { value: CustomerStatus.ACTIVE, label: 'Active' },
                { value: CustomerStatus.INACTIVE, label: 'Inactive' },
                { value: CustomerStatus.SUSPENDED, label: 'Suspended' },
                { value: CustomerStatus.PROSPECT, label: 'Prospect' }
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Type"
              options={[
                { value: '', label: 'All Types' },
                { value: CustomerTypes.INDIVIDUAL, label: 'Individual' },
                { value: CustomerTypes.CORPORATE, label: 'Corporate' },
                { value: CustomerTypes.VIP, label: 'VIP' }
              ]}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            />
            
            <Select
              label="Tier"
              options={[
                { value: '', label: 'All Tiers' },
                { value: 'bronze', label: 'Bronze' },
                { value: 'silver', label: 'Silver' },
                { value: 'gold', label: 'Gold' },
                { value: 'platinum', label: 'Platinum' }
              ]}
              value={filters.tier}
              onChange={(value) => handleFilterChange('tier', value)}
            />
            
            <Select
              label="Sort By"
              options={[
                { value: 'systemInfo.createdAt', label: 'Date Created' },
                { value: 'personalInfo.firstName', label: 'First Name' },
                { value: 'personalInfo.lastName', label: 'Last Name' },
                { value: 'segmentation.lifetimeValue', label: 'Lifetime Value' },
                { value: 'moveHistory.length', label: 'Total Moves' }
              ]}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moves
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LTV
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
                      <span className="text-gray-600">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No customers found</h3>
                      <p className="text-sm">Get started by adding your first customer.</p>
                      <Button
                        className="mt-4"
                        iconName="Plus"
                        onClick={onCreateCustomer}
                      >
                        Add Customer
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {customer.personalInfo.firstName.charAt(0)}
                              {customer.personalInfo.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCustomerName(customer)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.customerNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.contactInfo.email}</div>
                      <div className="text-sm text-gray-500">{customer.contactInfo.primaryPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatCustomerType(customer.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customer.segmentation.tier)}`}>
                        {customer.segmentation.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.moveHistory.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {customer.segmentation.lifetimeValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerSelect(customer);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer.id);
                          }}
                          className="text-red-600 hover:text-red-700"
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
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="rounded-l-md"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.totalPages || 
                      Math.abs(page - pagination.page) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <Button
                          variant={page === pagination.page ? "default" : "outline"}
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
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
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

export default CustomerList;
