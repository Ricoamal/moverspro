import React from 'react';
import { useStaff } from '../../../contexts/StaffContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StaffDetails = ({ staff, onEdit, onBack }) => {
  const { deleteStaff } = useStaff();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${staff.personalInfo.firstName} ${staff.personalInfo.lastName}?`)) {
      try {
        await deleteStaff(staff.id);
        onBack();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Error deleting staff. Please try again.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {staff.personalInfo.firstName} {staff.personalInfo.lastName}
              </h1>
              <p className="text-gray-600">
                {staff.employmentInfo.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                Employee ID: {staff.employmentInfo.employeeId}
              </p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.employmentInfo.status)}`}>
                  {staff.employmentInfo.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Edit"
              onClick={() => onEdit(staff)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              iconName="Trash2"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="User" size={20} className="mr-2" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">
                {staff.personalInfo.firstName} {staff.personalInfo.middleName} {staff.personalInfo.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">{formatDate(staff.personalInfo.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{staff.personalInfo.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID Number:</span>
              <span className="font-medium">{staff.personalInfo.idNumber || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{staff.personalInfo.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{staff.personalInfo.email}</span>
            </div>
            {staff.personalInfo.address && (
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium mt-1">{staff.personalInfo.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="Briefcase" size={20} className="mr-2" />
            Employment Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee ID:</span>
              <span className="font-medium">{staff.employmentInfo.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium">
                {staff.employmentInfo.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium">{staff.employmentInfo.department || 'Not assigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Employment Type:</span>
              <span className="font-medium">
                {staff.employmentInfo.employmentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">{formatDate(staff.employmentInfo.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supervisor:</span>
              <span className="font-medium">{staff.employmentInfo.supervisor || 'Not assigned'}</span>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="DollarSign" size={20} className="mr-2" />
            Compensation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Salary:</span>
              <span className="font-medium text-lg">{formatCurrency(staff.compensation.baseSalary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pay Frequency:</span>
              <span className="font-medium">
                {staff.compensation.payFrequency.replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            {staff.compensation.allowances && staff.compensation.allowances.length > 0 && (
              <div>
                <span className="text-gray-600">Allowances:</span>
                <ul className="mt-1 space-y-1">
                  {staff.compensation.allowances.map((allowance, index) => (
                    <li key={index} className="text-sm font-medium">
                      • {allowance.name}: {formatCurrency(allowance.amount)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Banking Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="CreditCard" size={20} className="mr-2" />
            Banking Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Name:</span>
              <span className="font-medium">{staff.bankingInfo.bankName || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{staff.bankingInfo.accountNumber || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Branch Code:</span>
              <span className="font-medium">{staff.bankingInfo.branchCode || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">M-Pesa Number:</span>
              <span className="font-medium">{staff.bankingInfo.mpesaNumber || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      {staff.emergencyContact && (staff.emergencyContact.name || staff.emergencyContact.phoneNumber) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="Phone" size={20} className="mr-2" />
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{staff.emergencyContact.name || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Relationship:</span>
              <span className="font-medium">{staff.emergencyContact.relationship || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{staff.emergencyContact.phoneNumber || 'Not provided'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {staff.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="FileText" size={20} className="mr-2" />
            Notes
          </h3>
          <p className="text-gray-700">{staff.notes}</p>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
