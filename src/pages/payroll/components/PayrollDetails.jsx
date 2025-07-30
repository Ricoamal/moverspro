import React, { useState, useEffect } from 'react';
import { usePayroll } from '../../../contexts/PayrollContext';
import { PayrollStatus } from '../../../types/payroll';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PayrollDetails = ({ period, onBack, onGenerate }) => {
  const { loadPayrollItems, approvePayrollPeriod, generatePayslip, exportPayrollData, loading } = usePayroll();
  const [payrollItems, setPayrollItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Load payroll items on mount
  useEffect(() => {
    if (period) {
      loadItems();
    }
  }, [period]);

  const loadItems = async () => {
    setLoadingItems(true);
    try {
      const result = await loadPayrollItems(period.id);
      if (result.success) {
        setPayrollItems(result.data);
      }
    } catch (error) {
      console.error('Error loading payroll items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  // Handle approval
  const handleApprove = async () => {
    if (confirm('Are you sure you want to approve this payroll period?')) {
      const result = await approvePayrollPeriod(period.id, 'Current User'); // TODO: Get from auth
      if (result.success) {
        alert('Payroll period approved successfully');
        // Refresh the period data
        window.location.reload(); // Simple refresh for demo
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  // Handle payslip generation
  const handleGeneratePayslip = async (payrollItemId) => {
    const result = await generatePayslip(payrollItemId);
    if (result.success) {
      alert('Payslip generated successfully');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Handle export
  const handleExport = async (format) => {
    const result = await exportPayrollData(period.id, format);
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

  if (!period) {
    return (
      <div className="text-center py-12">
        <Icon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Period Selected</h3>
        <p className="text-gray-600">Please select a payroll period to view details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{period.name}</h2>
            <div className="mt-2 space-y-1">
              <div className="text-sm text-gray-600">
                Period: {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                Pay Date: {new Date(period.payDate).toLocaleDateString()}
              </div>
              <div className="flex items-center mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(period.status)}`}>
                  {period.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {period.status === PayrollStatus.DRAFT && (
              <Button
                iconName="Play"
                onClick={() => onGenerate(period)}
              >
                Generate Payroll
              </Button>
            )}
            
            {period.status === PayrollStatus.PENDING_APPROVAL && (
              <Button
                iconName="Check"
                onClick={handleApprove}
                loading={loading}
              >
                Approve Payroll
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
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{period.totalEmployees}</div>
            <div className="text-sm text-gray-600">Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(period.totalGrossPay)}</div>
            <div className="text-sm text-gray-600">Gross Pay</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(period.totalTax)}</div>
            <div className="text-sm text-gray-600">PAYE Tax</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(period.totalNHIF)}</div>
            <div className="text-sm text-gray-600">NHIF</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(period.totalNSSF)}</div>
            <div className="text-sm text-gray-600">NSSF</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{formatCurrency(period.totalHousingLevy)}</div>
            <div className="text-sm text-gray-600">Housing Levy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(period.totalDeductions)}</div>
            <div className="text-sm text-gray-600">Total Deductions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(period.totalNetPay)}</div>
            <div className="text-sm text-gray-600">Net Pay</div>
          </div>
        </div>
      </div>

      {/* Payroll Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Employee Payroll Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PAYE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NHIF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NSSF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingItems ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-600">Loading payroll items...</span>
                    </div>
                  </td>
                </tr>
              ) : payrollItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No payroll items found</h3>
                      <p className="text-sm">
                        {period.status === PayrollStatus.DRAFT 
                          ? 'Generate payroll to create employee records for this period.'
                          : 'No employee records found for this payroll period.'
                        }
                      </p>
                      {period.status === PayrollStatus.DRAFT && (
                        <Button
                          className="mt-4"
                          iconName="Play"
                          onClick={() => onGenerate(period)}
                        >
                          Generate Payroll
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                payrollItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.employeeName}</div>
                        <div className="text-sm text-gray-500">{item.employeeNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.basicSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.grossPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.statutoryDeductions.paye)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.statutoryDeductions.nhif)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.statutoryDeductions.nssf)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.netPay)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="FileText"
                        onClick={() => handleGeneratePayslip(item.id)}
                      >
                        Payslip
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {period.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700">{period.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PayrollDetails;
