import React, { useState } from 'react';
import { usePayroll } from '../../../contexts/PayrollContext';
import { PayrollStatus } from '../../../types/payroll';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PayrollDashboard = ({ onCreatePeriod, onViewPeriod, onGeneratePayroll }) => {
  const {
    payrollPeriods,
    payrollStats,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPagination,
    clearError,
    exportPayrollData
  } = usePayroll();

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

  // Handle period selection
  const handlePeriodSelect = (period) => {
    if (onViewPeriod) {
      onViewPeriod(period);
    }
  };

  // Handle export
  const handleExport = async (periodId, format) => {
    const result = await exportPayrollData(periodId, format);
    if (!result.success) {
      alert(`Export failed: ${result.error}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case PayrollStatus.DRAFT:
        return 'text-gray-600 bg-gray-100';
      case PayrollStatus.PENDING_APPROVAL:
        return 'text-yellow-600 bg-yellow-100';
      case PayrollStatus.APPROVED:
        return 'text-blue-600 bg-blue-100';
      case PayrollStatus.PROCESSING:
        return 'text-purple-600 bg-purple-100';
      case PayrollStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case PayrollStatus.FAILED:
        return 'text-red-600 bg-red-100';
      case PayrollStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Payroll Data</h3>
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
          <h2 className="text-xl font-semibold text-gray-900">Payroll Dashboard</h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              onClick={() => {
                // Export all periods summary
                alert('Payroll summary export will be implemented');
              }}
            >
              Export Summary
            </Button>
            <Button
              iconName="Plus"
              onClick={onCreatePeriod}
            >
              New Payroll Period
            </Button>
          </div>
        </div>

        {/* Payroll Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{payrollStats.totalPeriods}</div>
            <div className="text-sm text-gray-600">Total Periods</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{payrollStats.currentYearPeriods}</div>
            <div className="text-sm text-gray-600">This Year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{payrollStats.pendingApproval}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{payrollStats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{payrollStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(payrollStats.totalPayrollValue)}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(payrollStats.totalTaxPaid)}
            </div>
            <div className="text-sm text-gray-600">Tax Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(payrollStats.averageNetPay)}
            </div>
            <div className="text-sm text-gray-600">Avg Net Pay</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search payroll periods..."
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
                { value: PayrollStatus.DRAFT, label: 'Draft' },
                { value: PayrollStatus.PENDING_APPROVAL, label: 'Pending Approval' },
                { value: PayrollStatus.APPROVED, label: 'Approved' },
                { value: PayrollStatus.PROCESSING, label: 'Processing' },
                { value: PayrollStatus.COMPLETED, label: 'Completed' },
                { value: PayrollStatus.FAILED, label: 'Failed' },
                { value: PayrollStatus.CANCELLED, label: 'Cancelled' }
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Year"
              options={[
                { value: '2024', label: '2024' },
                { value: '2023', label: '2023' },
                { value: '2022', label: '2022' }
              ]}
              value={filters.year}
              onChange={(value) => handleFilterChange('year', value)}
            />
            
            <Select
              label="Sort By"
              options={[
                { value: 'startDate', label: 'Start Date' },
                { value: 'payDate', label: 'Pay Date' },
                { value: 'totalNetPay', label: 'Total Amount' },
                { value: 'totalEmployees', label: 'Employee Count' }
              ]}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
            
            <Select
              label="Sort Order"
              options={[
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' }
              ]}
              value={filters.sortOrder}
              onChange={(value) => handleFilterChange('sortOrder', value)}
            />
          </div>
        )}
      </div>

      {/* Payroll Periods Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-600">Loading payroll periods...</span>
                    </div>
                  </td>
                </tr>
              ) : payrollPeriods.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No payroll periods found</h3>
                      <p className="text-sm">Get started by creating your first payroll period.</p>
                      <Button
                        className="mt-4"
                        iconName="Plus"
                        onClick={onCreatePeriod}
                      >
                        Create Payroll Period
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                payrollPeriods.map((period) => (
                  <tr
                    key={period.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePeriodSelect(period)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{period.name}</div>
                        <div className="text-sm text-gray-500">{period.periodType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pay Date: {new Date(period.payDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.totalEmployees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(period.totalGrossPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(period.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(period.totalNetPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(period.status)}`}>
                        {formatStatus(period.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePeriodSelect(period);
                          }}
                        />
                        
                        {period.status === PayrollStatus.DRAFT && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Play"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGeneratePayroll(period);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          />
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Download"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(period.id, 'csv');
                          }}
                          className="text-green-600 hover:text-green-700"
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

export default PayrollDashboard;
