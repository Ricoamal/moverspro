import React, { useState } from 'react';
import { usePayroll } from '../../../contexts/PayrollContext';
import { PayrollPeriodType } from '../../../types/payroll';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PayrollPeriodForm = ({ onSave, onCancel }) => {
  const { createPayrollPeriod, loading } = usePayroll();
  
  const [formData, setFormData] = useState({
    name: '',
    periodType: PayrollPeriodType.MONTHLY,
    startDate: '',
    endDate: '',
    payDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Auto-generate name if period type or dates change
    if (field === 'periodType' || field === 'startDate' || field === 'endDate') {
      generatePeriodName({ ...formData, [field]: value });
    }
  };

  // Generate period name based on type and dates
  const generatePeriodName = (data) => {
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      let name = '';
      
      switch (data.periodType) {
        case PayrollPeriodType.MONTHLY:
          name = `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Payroll`;
          break;
        case PayrollPeriodType.WEEKLY:
          name = `Week of ${startDate.toLocaleDateString()} Payroll`;
          break;
        case PayrollPeriodType.BIWEEKLY:
          name = `Bi-weekly ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} Payroll`;
          break;
        case PayrollPeriodType.QUARTERLY:
          const quarter = Math.floor(startDate.getMonth() / 3) + 1;
          name = `Q${quarter} ${startDate.getFullYear()} Payroll`;
          break;
        case PayrollPeriodType.ANNUALLY:
          name = `${startDate.getFullYear()} Annual Payroll`;
          break;
        default:
          name = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} Payroll`;
      }
      
      setFormData(prev => ({ ...prev, name }));
    }
  };

  // Auto-calculate end date based on period type and start date
  const calculateEndDate = (startDate, periodType) => {
    const start = new Date(startDate);
    let end = new Date(start);
    
    switch (periodType) {
      case PayrollPeriodType.WEEKLY:
        end.setDate(start.getDate() + 6);
        break;
      case PayrollPeriodType.BIWEEKLY:
        end.setDate(start.getDate() + 13);
        break;
      case PayrollPeriodType.MONTHLY:
        end.setMonth(start.getMonth() + 1);
        end.setDate(0); // Last day of the month
        break;
      case PayrollPeriodType.QUARTERLY:
        end.setMonth(start.getMonth() + 3);
        end.setDate(0);
        break;
      case PayrollPeriodType.ANNUALLY:
        end.setFullYear(start.getFullYear() + 1);
        end.setDate(0);
        break;
      default:
        end.setDate(start.getDate() + 30);
    }
    
    return end.toISOString().split('T')[0];
  };

  // Handle start date change
  const handleStartDateChange = (value) => {
    handleChange('startDate', value);
    
    if (value) {
      const calculatedEndDate = calculateEndDate(value, formData.periodType);
      handleChange('endDate', calculatedEndDate);
      
      // Set pay date to 5 days after end date
      const payDate = new Date(calculatedEndDate);
      payDate.setDate(payDate.getDate() + 5);
      handleChange('payDate', payDate.toISOString().split('T')[0]);
    }
  };

  // Handle period type change
  const handlePeriodTypeChange = (value) => {
    handleChange('periodType', value);
    
    if (formData.startDate) {
      const calculatedEndDate = calculateEndDate(formData.startDate, value);
      handleChange('endDate', calculatedEndDate);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Period name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.payDate) {
      newErrors.payDate = 'Pay date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.endDate && formData.payDate) {
      if (new Date(formData.payDate) <= new Date(formData.endDate)) {
        newErrors.payDate = 'Pay date must be after end date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createPayrollPeriod(formData);
      
      if (result.success) {
        onSave(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const periodTypeOptions = [
    { value: PayrollPeriodType.WEEKLY, label: 'Weekly' },
    { value: PayrollPeriodType.BIWEEKLY, label: 'Bi-weekly' },
    { value: PayrollPeriodType.MONTHLY, label: 'Monthly' },
    { value: PayrollPeriodType.QUARTERLY, label: 'Quarterly' },
    { value: PayrollPeriodType.ANNUALLY, label: 'Annually' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Payroll Period</h2>
            <p className="text-gray-600 mt-1">
              Set up a new payroll period for processing employee salaries
            </p>
          </div>
          <Button
            variant="ghost"
            iconName="X"
            onClick={onCancel}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Period Type */}
        <Select
          label="Period Type"
          options={periodTypeOptions}
          value={formData.periodType}
          onChange={handlePeriodTypeChange}
          error={errors.periodType}
          required
        />

        {/* Period Name */}
        <Input
          label="Period Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="e.g., January 2024 Payroll"
          required
        />

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            error={errors.startDate}
            required
          />
          
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            error={errors.endDate}
            required
          />
        </div>

        {/* Pay Date */}
        <Input
          label="Pay Date"
          type="date"
          value={formData.payDate}
          onChange={(e) => handleChange('payDate', e.target.value)}
          error={errors.payDate}
          help="Date when employees will receive their salaries"
          required
        />

        {/* Notes */}
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Any additional notes about this payroll period..."
          rows={3}
        />

        {/* Period Summary */}
        {formData.startDate && formData.endDate && formData.payDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Period Summary</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>
                <strong>Period:</strong> {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Duration:</strong> {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
              </div>
              <div>
                <strong>Pay Date:</strong> {new Date(formData.payDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Processing Time:</strong> {Math.ceil((new Date(formData.payDate) - new Date(formData.endDate)) / (1000 * 60 * 60 * 24))} days after period end
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            iconName="Save"
          >
            Create Period
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PayrollPeriodForm;
