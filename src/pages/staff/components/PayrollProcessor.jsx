import React, { useState, useEffect } from 'react';
import { useStaff } from '../../../contexts/StaffContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PayrollProcessor = ({ selectedStaff, onBack }) => {
  const { processBulkPayroll, processPayment, paymentStats, loading } = useStaff();
  
  const [payrollData, setPayrollData] = useState([]);
  const [payrollSummary, setPayrollSummary] = useState({
    totalEmployees: 0,
    totalGrossSalary: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    mpesaPayments: 0,
    bankTransfers: 0
  });
  const [processingStatus, setProcessingStatus] = useState('ready'); // ready, processing, completed, failed
  const [paymentResults, setPaymentResults] = useState(null);

  // Initialize payroll data
  useEffect(() => {
    if (selectedStaff && selectedStaff.length > 0) {
      const processedData = selectedStaff.map(employee => {
        const basicSalary = employee.payrollInfo.basicSalary || 0;
        const allowances = employee.payrollInfo.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
        const deductions = employee.payrollInfo.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
        const grossSalary = basicSalary + allowances;
        const netSalary = grossSalary - deductions;

        return {
          id: employee.id,
          employeeNumber: employee.employeeNumber,
          name: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
          department: employee.employmentInfo.department,
          role: employee.employmentInfo.role,
          basicSalary,
          allowances,
          deductions,
          grossSalary,
          netSalary,
          paymentMethod: employee.payrollInfo.paymentMethod,
          mpesaNumber: employee.payrollInfo.mpesaNumber,
          bankDetails: employee.payrollInfo.bankDetails,
          taxNumber: employee.payrollInfo.taxNumber,
          status: 'pending'
        };
      });

      setPayrollData(processedData);
      calculateSummary(processedData);
    }
  }, [selectedStaff]);

  // Calculate payroll summary
  const calculateSummary = (data) => {
    const summary = {
      totalEmployees: data.length,
      totalGrossSalary: data.reduce((sum, emp) => sum + emp.grossSalary, 0),
      totalDeductions: data.reduce((sum, emp) => sum + emp.deductions, 0),
      totalNetSalary: data.reduce((sum, emp) => sum + emp.netSalary, 0),
      mpesaPayments: data.filter(emp => emp.paymentMethod === 'mpesa').length,
      bankTransfers: data.filter(emp => emp.paymentMethod === 'bank_transfer').length
    };
    setPayrollSummary(summary);
  };

  // Handle individual salary adjustment
  const handleSalaryAdjustment = (employeeId, field, value) => {
    const updatedData = payrollData.map(emp => {
      if (emp.id === employeeId) {
        const updatedEmp = { ...emp, [field]: parseFloat(value) || 0 };
        updatedEmp.grossSalary = updatedEmp.basicSalary + updatedEmp.allowances;
        updatedEmp.netSalary = updatedEmp.grossSalary - updatedEmp.deductions;
        return updatedEmp;
      }
      return emp;
    });
    
    setPayrollData(updatedData);
    calculateSummary(updatedData);
  };

  // Process bulk payroll
  const handleProcessPayroll = async () => {
    setProcessingStatus('processing');
    
    try {
      // Filter only M-Pesa payments for this demo
      const mpesaPayments = payrollData.filter(emp => emp.paymentMethod === 'mpesa');
      
      if (mpesaPayments.length === 0) {
        alert('No M-Pesa payments to process. Please ensure staff have M-Pesa payment method configured.');
        setProcessingStatus('ready');
        return;
      }

      const result = await processBulkPayroll(mpesaPayments);
      
      if (result.success) {
        setPaymentResults(result.data);
        setProcessingStatus('completed');
        
        // Update individual statuses
        const updatedData = payrollData.map(emp => {
          const successfulPayment = result.data.results.successful.find(p => p.employee.id === emp.id);
          const failedPayment = result.data.results.failed.find(p => p.employee.id === emp.id);
          
          if (successfulPayment) {
            return { ...emp, status: 'completed' };
          } else if (failedPayment) {
            return { ...emp, status: 'failed', error: failedPayment.error };
          }
          return emp;
        });
        
        setPayrollData(updatedData);
      } else {
        setProcessingStatus('failed');
        alert(`Payroll processing failed: ${result.error}`);
      }
    } catch (error) {
      setProcessingStatus('failed');
      alert(`Error processing payroll: ${error.message}`);
    }
  };

  // Process individual payment
  const handleIndividualPayment = async (employee) => {
    if (employee.paymentMethod !== 'mpesa') {
      alert('Individual payments are currently only supported for M-Pesa');
      return;
    }

    try {
      const paymentData = {
        employeeId: employee.id,
        employeeName: employee.name,
        employeeNumber: employee.employeeNumber,
        phoneNumber: employee.mpesaNumber,
        amount: employee.netSalary,
        remarks: `Salary payment for ${employee.name} - ${new Date().toLocaleDateString()}`,
        occasion: 'Individual Salary Payment'
      };

      const result = await processPayment(paymentData);
      
      if (result.success) {
        // Update employee status
        const updatedData = payrollData.map(emp => 
          emp.id === employee.id ? { ...emp, status: 'completed' } : emp
        );
        setPayrollData(updatedData);
        alert('Payment processed successfully!');
      } else {
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Error processing payment: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payroll Summary</h2>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Payroll
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">M-Pesa Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{payrollSummary.totalEmployees}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(payrollSummary.totalGrossSalary)}</div>
            <div className="text-sm text-gray-600">Gross Salary</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(payrollSummary.totalDeductions)}</div>
            <div className="text-sm text-gray-600">Total Deductions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(payrollSummary.totalNetSalary)}</div>
            <div className="text-sm text-gray-600">Net Payable</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{payrollSummary.mpesaPayments}</div>
            <div className="text-sm text-gray-600">M-Pesa Payments</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{payrollSummary.bankTransfers}</div>
            <div className="text-sm text-gray-600">Bank Transfers</div>
          </div>
        </div>
      </div>

      {/* Processing Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payroll Processing</h3>
            <p className="text-gray-600 mt-1">
              Process salary payments via M-Pesa B2C integration
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="ArrowLeft"
              onClick={onBack}
            >
              Back to Staff
            </Button>
            
            <Button
              iconName="CreditCard"
              onClick={handleProcessPayroll}
              loading={loading || processingStatus === 'processing'}
              disabled={processingStatus === 'processing' || payrollSummary.mpesaPayments === 0}
            >
              {processingStatus === 'processing' ? 'Processing...' : `Process M-Pesa Payments (${payrollSummary.mpesaPayments})`}
            </Button>
          </div>
        </div>

        {/* Processing Status */}
        {processingStatus !== 'ready' && (
          <div className="mt-4 p-4 rounded-lg border">
            {processingStatus === 'processing' && (
              <div className="flex items-center text-blue-600">
                <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                <span>Processing payroll payments...</span>
              </div>
            )}
            
            {processingStatus === 'completed' && paymentResults && (
              <div className="text-green-600">
                <div className="flex items-center mb-2">
                  <Icon name="CheckCircle" size={20} className="mr-2" />
                  <span className="font-medium">Payroll processing completed!</span>
                </div>
                <div className="text-sm">
                  Successful: {paymentResults.successfulPayments} | 
                  Failed: {paymentResults.failedPayments} | 
                  Total Amount: {formatCurrency(paymentResults.successfulAmount)}
                </div>
              </div>
            )}
            
            {processingStatus === 'failed' && (
              <div className="flex items-center text-red-600">
                <Icon name="XCircle" size={20} className="mr-2" />
                <span>Payroll processing failed. Please try again.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Employee Payroll Details */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allowances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
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
              {payrollData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employeeNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      type="number"
                      value={employee.basicSalary}
                      onChange={(e) => handleSalaryAdjustment(employee.id, 'basicSalary', e.target.value)}
                      className="w-24 text-sm"
                      disabled={employee.status === 'completed'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      type="number"
                      value={employee.allowances}
                      onChange={(e) => handleSalaryAdjustment(employee.id, 'allowances', e.target.value)}
                      className="w-24 text-sm"
                      disabled={employee.status === 'completed'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      type="number"
                      value={employee.deductions}
                      onChange={(e) => handleSalaryAdjustment(employee.id, 'deductions', e.target.value)}
                      className="w-24 text-sm"
                      disabled={employee.status === 'completed'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(employee.netSalary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon 
                        name={employee.paymentMethod === 'mpesa' ? 'Smartphone' : 'CreditCard'} 
                        size={16} 
                        className="text-gray-400 mr-2" 
                      />
                      <span className="text-sm text-gray-900">
                        {employee.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Bank Transfer'}
                      </span>
                    </div>
                    {employee.paymentMethod === 'mpesa' && (
                      <div className="text-xs text-gray-500">{employee.mpesaNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                    {employee.error && (
                      <div className="text-xs text-red-500 mt-1">{employee.error}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {employee.paymentMethod === 'mpesa' && employee.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Send"
                        onClick={() => handleIndividualPayment(employee)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollProcessor;
