import React, { useState } from 'react';
import { useStaff } from '../../../contexts/StaffContext';
import { StaffRoles, EmploymentType, StaffStatus } from '../../../types/staff';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import Icon from '../../../components/AppIcon';

const StaffForm = ({ staff, onSave, onCancel, mode = 'create' }) => {
  const { createStaff, updateStaff, loading } = useStaff();
  
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: staff?.personalInfo?.firstName || '',
      lastName: staff?.personalInfo?.lastName || '',
      middleName: staff?.personalInfo?.middleName || '',
      dateOfBirth: staff?.personalInfo?.dateOfBirth || '',
      gender: staff?.personalInfo?.gender || '',
      nationality: staff?.personalInfo?.nationality || 'Kenyan',
      idNumber: staff?.personalInfo?.idNumber || '',
      phoneNumber: staff?.personalInfo?.phoneNumber || '',
      email: staff?.personalInfo?.email || '',
      address: staff?.personalInfo?.address || ''
    },
    employmentInfo: {
      employeeId: staff?.employmentInfo?.employeeId || '',
      role: staff?.employmentInfo?.role || StaffRoles.MOVER,
      department: staff?.employmentInfo?.department || '',
      employmentType: staff?.employmentInfo?.employmentType || EmploymentType.FULL_TIME,
      startDate: staff?.employmentInfo?.startDate || '',
      status: staff?.employmentInfo?.status || StaffStatus.ACTIVE,
      supervisor: staff?.employmentInfo?.supervisor || '',
      workLocation: staff?.employmentInfo?.workLocation || ''
    },
    compensation: {
      baseSalary: staff?.compensation?.baseSalary || 0,
      currency: staff?.compensation?.currency || 'KES',
      payFrequency: staff?.compensation?.payFrequency || 'monthly',
      allowances: staff?.compensation?.allowances || [],
      benefits: staff?.compensation?.benefits || []
    },
    bankingInfo: {
      bankName: staff?.bankingInfo?.bankName || '',
      accountNumber: staff?.bankingInfo?.accountNumber || '',
      branchCode: staff?.bankingInfo?.branchCode || '',
      mpesaNumber: staff?.bankingInfo?.mpesaNumber || ''
    },
    emergencyContact: {
      name: staff?.emergencyContact?.name || '',
      relationship: staff?.emergencyContact?.relationship || '',
      phoneNumber: staff?.emergencyContact?.phoneNumber || '',
      address: staff?.emergencyContact?.address || ''
    },
    notes: staff?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.personalInfo.firstName) {
      newErrors['personalInfo.firstName'] = 'First name is required';
    }
    if (!formData.personalInfo.lastName) {
      newErrors['personalInfo.lastName'] = 'Last name is required';
    }
    if (!formData.personalInfo.email) {
      newErrors['personalInfo.email'] = 'Email is required';
    }
    if (!formData.personalInfo.phoneNumber) {
      newErrors['personalInfo.phoneNumber'] = 'Phone number is required';
    }
    if (!formData.employmentInfo.employeeId) {
      newErrors['employmentInfo.employeeId'] = 'Employee ID is required';
    }
    if (!formData.employmentInfo.startDate) {
      newErrors['employmentInfo.startDate'] = 'Start date is required';
    }
    if (!formData.compensation.baseSalary || formData.compensation.baseSalary <= 0) {
      newErrors['compensation.baseSalary'] = 'Base salary is required and must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let savedStaff;
      if (mode === 'create') {
        savedStaff = await createStaff(formData);
      } else {
        savedStaff = await updateStaff(staff.id, formData);
      }
      
      onSave(savedStaff);
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Error saving staff. Please try again.');
    }
  };

  const roleOptions = Object.values(StaffRoles).map(role => ({
    value: role,
    label: role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const employmentTypeOptions = Object.values(EmploymentType).map(type => ({
    value: type,
    label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const statusOptions = Object.values(StaffStatus).map(status => ({
    value: status,
    label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              value={formData.personalInfo.firstName}
              onChange={(value) => handleInputChange('personalInfo', 'firstName', value)}
              error={errors['personalInfo.firstName']}
            />
            <Input
              label="Last Name *"
              value={formData.personalInfo.lastName}
              onChange={(value) => handleInputChange('personalInfo', 'lastName', value)}
              error={errors['personalInfo.lastName']}
            />
            <Input
              label="Middle Name"
              value={formData.personalInfo.middleName}
              onChange={(value) => handleInputChange('personalInfo', 'middleName', value)}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(value) => handleInputChange('personalInfo', 'dateOfBirth', value)}
            />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
              value={formData.personalInfo.gender}
              onChange={(value) => handleInputChange('personalInfo', 'gender', value)}
            />
            <Input
              label="ID Number"
              value={formData.personalInfo.idNumber}
              onChange={(value) => handleInputChange('personalInfo', 'idNumber', value)}
            />
            <Input
              label="Phone Number *"
              value={formData.personalInfo.phoneNumber}
              onChange={(value) => handleInputChange('personalInfo', 'phoneNumber', value)}
              error={errors['personalInfo.phoneNumber']}
            />
            <Input
              label="Email *"
              type="email"
              value={formData.personalInfo.email}
              onChange={(value) => handleInputChange('personalInfo', 'email', value)}
              error={errors['personalInfo.email']}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Address"
              value={formData.personalInfo.address}
              onChange={(value) => handleInputChange('personalInfo', 'address', value)}
              rows={3}
            />
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              value={formData.employmentInfo.employeeId}
              onChange={(value) => handleInputChange('employmentInfo', 'employeeId', value)}
              error={errors['employmentInfo.employeeId']}
            />
            <Select
              label="Role *"
              options={roleOptions}
              value={formData.employmentInfo.role}
              onChange={(value) => handleInputChange('employmentInfo', 'role', value)}
            />
            <Input
              label="Department"
              value={formData.employmentInfo.department}
              onChange={(value) => handleInputChange('employmentInfo', 'department', value)}
            />
            <Select
              label="Employment Type"
              options={employmentTypeOptions}
              value={formData.employmentInfo.employmentType}
              onChange={(value) => handleInputChange('employmentInfo', 'employmentType', value)}
            />
            <Input
              label="Start Date *"
              type="date"
              value={formData.employmentInfo.startDate}
              onChange={(value) => handleInputChange('employmentInfo', 'startDate', value)}
              error={errors['employmentInfo.startDate']}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={formData.employmentInfo.status}
              onChange={(value) => handleInputChange('employmentInfo', 'status', value)}
            />
          </div>
        </div>

        {/* Compensation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Base Salary (KES) *"
              type="number"
              value={formData.compensation.baseSalary}
              onChange={(value) => handleInputChange('compensation', 'baseSalary', parseFloat(value) || 0)}
              error={errors['compensation.baseSalary']}
            />
            <Select
              label="Pay Frequency"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'bi-weekly', label: 'Bi-weekly' },
                { value: 'weekly', label: 'Weekly' }
              ]}
              value={formData.compensation.payFrequency}
              onChange={(value) => handleInputChange('compensation', 'payFrequency', value)}
            />
          </div>
        </div>

        {/* Banking Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              value={formData.bankingInfo.bankName}
              onChange={(value) => handleInputChange('bankingInfo', 'bankName', value)}
            />
            <Input
              label="Account Number"
              value={formData.bankingInfo.accountNumber}
              onChange={(value) => handleInputChange('bankingInfo', 'accountNumber', value)}
            />
            <Input
              label="Branch Code"
              value={formData.bankingInfo.branchCode}
              onChange={(value) => handleInputChange('bankingInfo', 'branchCode', value)}
            />
            <Input
              label="M-Pesa Number"
              value={formData.bankingInfo.mpesaNumber}
              onChange={(value) => handleInputChange('bankingInfo', 'mpesaNumber', value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            iconName="Save"
          >
            {mode === 'create' ? 'Create Staff' : 'Update Staff'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
