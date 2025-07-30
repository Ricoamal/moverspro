import React, { useState, useEffect } from 'react';
import { usePayroll } from '../../../contexts/PayrollContext';
import { useStaff } from '../../../contexts/StaffContext';
import { StaffStatus } from '../../../types/staff';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PayrollGenerator = ({ period, onBack, onComplete }) => {
  const { generatePayroll, calculatePayrollItem, loading } = usePayroll();
  const { staff: allStaff } = useStaff();
  
  const [eligibleStaff, setEligibleStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [adjustments, setAdjustments] = useState({});
  const [payrollPreview, setPayrollPreview] = useState(null);
  const [step, setStep] = useState(1); // 1: Select Staff, 2: Adjustments, 3: Preview, 4: Generate

  // Load eligible staff on mount
  useEffect(() => {
    if (allStaff && allStaff.length > 0) {
      const eligible = allStaff.filter(employee => 
        employee.status === StaffStatus.ACTIVE || employee.status === StaffStatus.ON_LEAVE
      );
      setEligibleStaff(eligible);
      setSelectedStaff(eligible.map(emp => emp.id));
    }
  }, [allStaff]);

  // Handle staff selection
  const handleStaffSelect = (staffId, selected) => {
    if (selected) {
      setSelectedStaff([...selectedStaff, staffId]);
    } else {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    }
  };

  // Handle select all
  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedStaff(eligibleStaff.map(emp => emp.id));
    } else {
      setSelectedStaff([]);
    }
  };

  // Handle adjustment changes
  const handleAdjustmentChange = (employeeId, field, value) => {
    setAdjustments(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  // Calculate payroll preview
  const calculatePreview = async () => {
    const selectedEmployees = eligibleStaff.filter(emp => selectedStaff.includes(emp.id));
    const previewItems = [];
    
    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let totalTax = 0;
    let totalNHIF = 0;
    let totalNSSF = 0;
    let totalHousingLevy = 0;

    for (const employee of selectedEmployees) {
      const employeeAdjustments = adjustments[employee.id] || {};
      const result = await calculatePayrollItem(employee, period, employeeAdjustments);
      
      if (result.success) {
        previewItems.push(result.data);
        totalGross += result.data.grossPay;
        totalDeductions += result.data.statutoryDeductions.total + result.data.totalDeductions;
        totalNet += result.data.netPay;
        totalTax += result.data.statutoryDeductions.paye;
        totalNHIF += result.data.statutoryDeductions.nhif;
        totalNSSF += result.data.statutoryDeductions.nssf;
        totalHousingLevy += result.data.statutoryDeductions.housingLevy;
      }
    }

    setPayrollPreview({
      items: previewItems,
      summary: {
        totalEmployees: previewItems.length,
        totalGross,
        totalDeductions,
        totalNet,
        totalTax,
        totalNHIF,
        totalNSSF,
        totalHousingLevy
      }
    });
  };

  // Generate payroll
  const handleGeneratePayroll = async () => {
    const selectedEmployees = eligibleStaff.filter(emp => selectedStaff.includes(emp.id));
    
    const result = await generatePayroll(period.id, selectedEmployees, adjustments);
    
    if (result.success) {
      onComplete(result.data.payrollPeriod);
    } else {
      alert(`Error generating payroll: ${result.error}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Get working days for the period
  const getWorkingDays = () => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    let workingDays = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        workingDays++;
      }
    }
    
    return workingDays;
  };

  const workingDays = getWorkingDays();

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Generate Payroll: {period.name}</h2>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber < 4 ? 'mr-4' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <div>Period: {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}</div>
          <div>Working Days: {workingDays} | Pay Date: {new Date(period.payDate).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Step 1: Select Staff */}
      {step === 1 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Step 1: Select Employees</h3>
            <p className="text-gray-600 mt-1">Choose which employees to include in this payroll</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStaff.length === eligibleStaff.length && eligibleStaff.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="ml-2 text-sm font-medium text-gray-900">
                  Select All ({eligibleStaff.length} employees)
                </label>
              </div>
              <div className="text-sm text-gray-600">
                {selectedStaff.length} of {eligibleStaff.length} selected
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {eligibleStaff.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(employee.id)}
                      onChange={(e) => handleStaffSelect(employee.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.employeeNumber} • {employee.employmentInfo.role} • {employee.employmentInfo.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatCurrency(employee.payrollInfo.basicSalary)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={selectedStaff.length === 0}
                iconName="ArrowRight"
              >
                Next: Adjustments
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Adjustments */}
      {step === 2 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Step 2: Salary Adjustments</h3>
            <p className="text-gray-600 mt-1">Make any necessary adjustments to employee salaries</p>
          </div>
          
          <div className="p-6">
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
                      Days Worked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overtime Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonus
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eligibleStaff
                    .filter(emp => selectedStaff.includes(emp.id))
                    .map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{employee.employeeNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={adjustments[employee.id]?.basicSalary || employee.payrollInfo.basicSalary}
                            onChange={(e) => handleAdjustmentChange(employee.id, 'basicSalary', e.target.value)}
                            className="w-32"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={adjustments[employee.id]?.daysWorked || workingDays}
                            onChange={(e) => handleAdjustmentChange(employee.id, 'daysWorked', e.target.value)}
                            className="w-20"
                            min="0"
                            max={workingDays}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={adjustments[employee.id]?.overtimeHours || 0}
                            onChange={(e) => handleAdjustmentChange(employee.id, 'overtimeHours', e.target.value)}
                            className="w-20"
                            min="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            value={adjustments[employee.id]?.bonus || 0}
                            onChange={(e) => handleAdjustmentChange(employee.id, 'bonus', e.target.value)}
                            className="w-32"
                            min="0"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                iconName="ArrowLeft"
              >
                Back: Select Staff
              </Button>
              <Button
                onClick={() => {
                  calculatePreview();
                  setStep(3);
                }}
                iconName="ArrowRight"
              >
                Next: Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Step 3: Payroll Preview</h3>
            <p className="text-gray-600 mt-1">Review payroll calculations before generating</p>
          </div>
          
          <div className="p-6">
            {payrollPreview && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{payrollPreview.summary.totalEmployees}</div>
                    <div className="text-xs text-gray-600">Employees</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(payrollPreview.summary.totalGross)}</div>
                    <div className="text-xs text-gray-600">Gross Pay</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{formatCurrency(payrollPreview.summary.totalTax)}</div>
                    <div className="text-xs text-gray-600">PAYE Tax</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{formatCurrency(payrollPreview.summary.totalNHIF)}</div>
                    <div className="text-xs text-gray-600">NHIF</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{formatCurrency(payrollPreview.summary.totalNSSF)}</div>
                    <div className="text-xs text-gray-600">NSSF</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600">{formatCurrency(payrollPreview.summary.totalHousingLevy)}</div>
                    <div className="text-xs text-gray-600">Housing Levy</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(payrollPreview.summary.totalNet)}</div>
                    <div className="text-xs text-gray-600">Net Pay</div>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payrollPreview.items.map((item) => (
                        <tr key={item.employeeId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.employeeName}</div>
                            <div className="text-sm text-gray-500">{item.employeeNumber}</div>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                iconName="ArrowLeft"
              >
                Back: Adjustments
              </Button>
              <Button
                onClick={() => setStep(4)}
                iconName="ArrowRight"
              >
                Generate Payroll
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Generate */}
      {step === 4 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Step 4: Generate Payroll</h3>
            <p className="text-gray-600 mt-1">Confirm and generate the payroll for this period</p>
          </div>
          
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={64} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Payroll</h3>
            <p className="text-gray-600 mb-6">
              This will create payroll records for {selectedStaff.length} employees and set the period status to "Pending Approval".
            </p>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                iconName="ArrowLeft"
              >
                Back: Preview
              </Button>
              <Button
                onClick={handleGeneratePayroll}
                loading={loading}
                iconName="Play"
              >
                Generate Payroll
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollGenerator;
