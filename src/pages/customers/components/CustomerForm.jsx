import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../../contexts/CustomerContext';
import { CustomerTypes, CustomerStatus, AddressTypes, CommunicationPreferences } from '../../../types/customer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Toggle from '../../../components/ui/Toggle';
import FileUpload from '../../../components/ui/FileUpload';
import Icon from '../../../components/AppIcon';

const CustomerForm = ({ customer, onSave, onCancel, mode = 'create' }) => {
  const { createCustomer, updateCustomer, loading } = useCustomers();
  
  const [formData, setFormData] = useState({
    type: CustomerTypes.INDIVIDUAL,
    status: CustomerStatus.ACTIVE,
    personalInfo: {
      title: '',
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Kenyan',
      idNumber: '',
      passportNumber: '',
      profilePhoto: null
    },
    contactInfo: {
      primaryPhone: '',
      secondaryPhone: '',
      email: '',
      alternateEmail: '',
      whatsappNumber: '',
      preferredContactMethod: CommunicationPreferences.EMAIL,
      preferredContactTime: 'anytime'
    },
    addresses: [{
      type: AddressTypes.HOME,
      isPrimary: true,
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      accessInstructions: '',
      isActive: true
    }],
    corporateInfo: {
      companyName: '',
      registrationNumber: '',
      taxNumber: '',
      industry: '',
      companySize: '',
      website: '',
      contactPerson: {
        name: '',
        title: '',
        phone: '',
        email: ''
      }
    },
    emergencyContacts: [{
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: ''
    }],
    preferences: {
      preferredServices: [],
      specialRequirements: '',
      accessibilityNeeds: '',
      petInformation: '',
      valuableItems: '',
      packingPreferences: {
        selfPack: false,
        partialPack: false,
        fullPack: false
      },
      insurancePreferences: {
        basicCoverage: true,
        fullCoverage: false,
        customCoverage: false
      },
      communicationPreferences: {
        smsUpdates: true,
        emailUpdates: true,
        whatsappUpdates: false,
        callUpdates: false
      }
    },
    privacy: {
      marketingConsent: false,
      dataProcessingConsent: true,
      thirdPartySharing: false,
      communicationConsent: {
        email: true,
        sms: true,
        phone: false,
        whatsapp: false
      }
    }
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form with customer data if editing
  useEffect(() => {
    if (customer && mode === 'edit') {
      setFormData(customer);
    }
  }, [customer, mode]);

  // Handle form field changes
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error for this field
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  // Handle nested field changes
  const handleNestedChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  // Handle array field changes
  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new address
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        type: AddressTypes.WORK,
        isPrimary: false,
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Kenya',
        accessInstructions: '',
        isActive: true
      }]
    }));
  };

  // Remove address
  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index)
      }));
    }
  };

  // Add emergency contact
  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        address: ''
      }]
    }));
  };

  // Remove emergency contact
  const removeEmergencyContact = (index) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.personalInfo.firstName.trim()) {
      newErrors['personalInfo.firstName'] = 'First name is required';
    }
    if (!formData.personalInfo.lastName.trim()) {
      newErrors['personalInfo.lastName'] = 'Last name is required';
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors['contactInfo.email'] = 'Invalid email format';
    }
    if (!formData.contactInfo.primaryPhone.trim()) {
      newErrors['contactInfo.primaryPhone'] = 'Primary phone is required';
    }

    // Corporate validation
    if (formData.type === CustomerTypes.CORPORATE && !formData.corporateInfo.companyName.trim()) {
      newErrors['corporateInfo.companyName'] = 'Company name is required for corporate customers';
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
      let result;
      if (mode === 'create') {
        result = await createCustomer(formData);
      } else {
        result = await updateCustomer(customer.id, formData);
      }

      if (result.success) {
        onSave(result.data);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
    { id: 'address', label: 'Addresses', icon: 'MapPin' },
    { id: 'corporate', label: 'Corporate', icon: 'Building' },
    { id: 'emergency', label: 'Emergency', icon: 'AlertTriangle' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' }
  ];

  const titleOptions = [
    { value: '', label: 'Select Title' },
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const contactTimeOptions = [
    { value: 'anytime', label: 'Anytime' },
    { value: 'morning', label: 'Morning (8AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { value: 'evening', label: 'Evening (6PM - 10PM)' }
  ];

  const companySizeOptions = [
    { value: '', label: 'Select Company Size' },
    { value: 'small', label: 'Small (1-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

  const relationshipOptions = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'create' 
                ? 'Enter customer information to create a new customer record'
                : 'Update customer information'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            iconName="X"
            onClick={onCancel}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Customer Type"
                options={[
                  { value: CustomerTypes.INDIVIDUAL, label: 'Individual' },
                  { value: CustomerTypes.CORPORATE, label: 'Corporate' },
                  { value: CustomerTypes.VIP, label: 'VIP' }
                ]}
                value={formData.type}
                onChange={(value) => handleChange('', 'type', value)}
                required
              />
              
              <Select
                label="Status"
                options={[
                  { value: CustomerStatus.ACTIVE, label: 'Active' },
                  { value: CustomerStatus.INACTIVE, label: 'Inactive' },
                  { value: CustomerStatus.PROSPECT, label: 'Prospect' },
                  { value: CustomerStatus.SUSPENDED, label: 'Suspended' }
                ]}
                value={formData.status}
                onChange={(value) => handleChange('', 'status', value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Select
                label="Title"
                options={titleOptions}
                value={formData.personalInfo.title}
                onChange={(value) => handleChange('personalInfo', 'title', value)}
              />
              
              <Input
                label="First Name"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                error={errors['personalInfo.firstName']}
                required
              />
              
              <Input
                label="Middle Name"
                value={formData.personalInfo.middleName}
                onChange={(e) => handleChange('personalInfo', 'middleName', e.target.value)}
              />
              
              <Input
                label="Last Name"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                error={errors['personalInfo.lastName']}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Date of Birth"
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
              />
              
              <Select
                label="Gender"
                options={genderOptions}
                value={formData.personalInfo.gender}
                onChange={(value) => handleChange('personalInfo', 'gender', value)}
              />
              
              <Input
                label="Nationality"
                value={formData.personalInfo.nationality}
                onChange={(e) => handleChange('personalInfo', 'nationality', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="ID Number"
                value={formData.personalInfo.idNumber}
                onChange={(e) => handleChange('personalInfo', 'idNumber', e.target.value)}
                placeholder="12345678"
              />
              
              <Input
                label="Passport Number"
                value={formData.personalInfo.passportNumber}
                onChange={(e) => handleChange('personalInfo', 'passportNumber', e.target.value)}
              />
            </div>

            <FileUpload
              label="Profile Photo"
              accept="image/*"
              maxSize={2 * 1024 * 1024} // 2MB
              onFileSelect={(file) => handleChange('personalInfo', 'profilePhoto', file)}
              description="Upload a profile photo (max 2MB)"
            />
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Primary Phone"
                value={formData.contactInfo.primaryPhone}
                onChange={(e) => handleChange('contactInfo', 'primaryPhone', e.target.value)}
                error={errors['contactInfo.primaryPhone']}
                placeholder="+254 700 123 456"
                required
              />
              
              <Input
                label="Secondary Phone"
                value={formData.contactInfo.secondaryPhone}
                onChange={(e) => handleChange('contactInfo', 'secondaryPhone', e.target.value)}
                placeholder="+254 700 123 456"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleChange('contactInfo', 'email', e.target.value)}
                error={errors['contactInfo.email']}
                required
              />
              
              <Input
                label="Alternate Email"
                type="email"
                value={formData.contactInfo.alternateEmail}
                onChange={(e) => handleChange('contactInfo', 'alternateEmail', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="WhatsApp Number"
                value={formData.contactInfo.whatsappNumber}
                onChange={(e) => handleChange('contactInfo', 'whatsappNumber', e.target.value)}
                placeholder="+254 700 123 456"
              />
              
              <Select
                label="Preferred Contact Method"
                options={[
                  { value: CommunicationPreferences.EMAIL, label: 'Email' },
                  { value: CommunicationPreferences.SMS, label: 'SMS' },
                  { value: CommunicationPreferences.PHONE, label: 'Phone' },
                  { value: CommunicationPreferences.WHATSAPP, label: 'WhatsApp' }
                ]}
                value={formData.contactInfo.preferredContactMethod}
                onChange={(value) => handleChange('contactInfo', 'preferredContactMethod', value)}
              />
            </div>

            <Select
              label="Preferred Contact Time"
              options={contactTimeOptions}
              value={formData.contactInfo.preferredContactTime}
              onChange={(value) => handleChange('contactInfo', 'preferredContactTime', value)}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
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
            {mode === 'create' ? 'Create Customer' : 'Update Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
