import React, { useState } from 'react';
import { useStaff } from '../../../contexts/StaffContext';
import { StaffStatus, StaffRoles, Departments, EmploymentType } from '../../../types/staff';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const StaffList = ({ onStaffSelect, onCreateStaff, onProcessPayroll }) => {
  const {
    staff,
    loading,
    error,
    filters,
    pagination,
    staffStats,
    setFilters,
    setPagination,
    deleteStaff,
    exportStaff,
    clearError
  } = useStaff();

  const [selectedStaff, setSelectedStaff] = useState([]);
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

  // Handle staff selection
  const handleStaffSelect = (employee) => {
    if (onStaffSelect) {
      onStaffSelect(employee);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async (staffId) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      const result = await deleteStaff(staffId);
      if (result.success) {
        alert('Staff member deleted successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  // Handle bulk selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaff(staff.map(s => s.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelectStaff = (staffId, checked) => {
    if (checked) {
      setSelectedStaff([...selectedStaff, staffId]);
    } else {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    }
  };

  // Handle export
  const handleExport = async (format) => {
    const result = await exportStaff(format);
    if (!result.success) {
      alert(`Export failed: ${result.error}`);
    }
  };

  // Handle bulk payroll processing
  const handleBulkPayroll = () => {
    if (selectedStaff.length === 0) {
      alert('Please select staff members for payroll processing');
      return;
    }
    
    const selectedEmployees = staff.filter(s => selectedStaff.includes(s.id));
    onProcessPayroll(selectedEmployees);
  };

  // Format staff data for display
  const formatStaffName = (employee) => {
    return `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`;
  };

  const formatRole = (role) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDepartment = (department) => {
    return department.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case StaffStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case StaffStatus.INACTIVE:
        return 'text-gray-600 bg-gray-100';
      case StaffStatus.ON_LEAVE:
        return 'text-blue-600 bg-blue-100';
      case StaffStatus.SUSPENDED:
        return 'text-red-600 bg-red-100';
      case StaffStatus.PROBATION:
        return 'text-yellow-600 bg-yellow-100';
      case StaffStatus.TERMINATED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case StaffRoles.ADMIN:
        return 'text-purple-600 bg-purple-100';
      case StaffRoles.MANAGER:
        return 'text-blue-600 bg-blue-100';
      case StaffRoles.SUPERVISOR:
        return 'text-indigo-600 bg-indigo-100';
      case StaffRoles.TEAM_LEAD:
        return 'text-cyan-600 bg-cyan-100';
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
            <h3 className="text-red-800 font-medium">Error Loading Staff</h3>
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
          <h2 className="text-xl font-semibold text-gray-900">Staff Management</h2>
          <div className="flex items-center space-x-3">
            {selectedStaff.length > 0 && (
              <Button
                variant="outline"
                iconName="CreditCard"
                onClick={handleBulkPayroll}
              >
                Process Payroll ({selectedStaff.length})
              </Button>
            )}
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
              onClick={onCreateStaff}
            >
              Add Staff
            </Button>
          </div>
        </div>

        {/* Staff Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{staffStats.total}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{staffStats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{staffStats.onLeave}</div>
            <div className="text-sm text-gray-600">On Leave</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{staffStats.probation}</div>
            <div className="text-sm text-gray-600">Probation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              KSh {staffStats.totalSalaryBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              KSh {Math.round(staffStats.averageSalary).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Avg Salary</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search staff..."
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
            <Select
              label="Status"
              options={[
                { value: '', label: 'All Statuses' },
                { value: StaffStatus.ACTIVE, label: 'Active' },
                { value: StaffStatus.INACTIVE, label: 'Inactive' },
                { value: StaffStatus.ON_LEAVE, label: 'On Leave' },
                { value: StaffStatus.SUSPENDED, label: 'Suspended' },
                { value: StaffStatus.PROBATION, label: 'Probation' }
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Role"
              options={[
                { value: '', label: 'All Roles' },
                ...Object.values(StaffRoles).map(role => ({
                  value: role,
                  label: formatRole(role)
                }))
              ]}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
            />
            
            <Select
              label="Department"
              options={[
                { value: '', label: 'All Departments' },
                ...Object.values(Departments).map(dept => ({
                  value: dept,
                  label: formatDepartment(dept)
                }))
              ]}
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
            
            <Select
              label="Employment Type"
              options={[
                { value: '', label: 'All Types' },
                ...Object.values(EmploymentType).map(type => ({
                  value: type,
                  label: formatRole(type)
                }))
              ]}
              value={filters.employmentType}
              onChange={(value) => handleFilterChange('employmentType', value)}
            />
            
            <Select
              label="Sort By"
              options={[
                { value: 'systemInfo.createdAt', label: 'Date Hired' },
                { value: 'personalInfo.firstName', label: 'First Name' },
                { value: 'personalInfo.lastName', label: 'Last Name' },
                { value: 'payrollInfo.basicSalary', label: 'Salary' },
                { value: 'employmentInfo.role', label: 'Role' }
              ]}
              value={filters.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>
        )}
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === staff.length && staff.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
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
                      <span className="text-gray-600">Loading staff...</span>
                    </div>
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No staff found</h3>
                      <p className="text-sm">Get started by adding your first staff member.</p>
                      <Button
                        className="mt-4"
                        iconName="Plus"
                        onClick={onCreateStaff}
                      >
                        Add Staff Member
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStaffSelect(employee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(employee.id)}
                        onChange={(e) => handleSelectStaff(employee.id, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {employee.personalInfo.firstName.charAt(0)}
                              {employee.personalInfo.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatStaffName(employee)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.employeeNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.contactInfo.email}</div>
                      <div className="text-sm text-gray-500">{employee.contactInfo.primaryPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.employmentInfo.role)}`}>
                        {formatRole(employee.employmentInfo.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDepartment(employee.employmentInfo.department)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {employee.payrollInfo.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon 
                          name={employee.payrollInfo.paymentMethod === 'mpesa' ? 'Smartphone' : 'CreditCard'} 
                          size={16} 
                          className="text-gray-400 mr-2" 
                        />
                        <span className="text-sm text-gray-900">
                          {employee.payrollInfo.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Bank Transfer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStaffSelect(employee);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStaff(employee.id);
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

export default StaffList;
