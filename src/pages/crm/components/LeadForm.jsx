import React, { useState } from 'react';
import { useCRM } from '../../../contexts/CRMContext';
import { LeadSources, LeadStatus } from '../../../types/crm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LeadForm = ({ lead, onSave, onCancel }) => {
  const { createLead, updateLead, loading } = useCRM();
  
  const [formData, setFormData] = useState({
    firstName: lead?.firstName || '',
    lastName: lead?.lastName || '',
    company: lead?.company || '',
    title: lead?.title || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    website: lead?.website || '',
    source: lead?.source || LeadSources.WEBSITE,
    status: lead?.status || LeadStatus.NEW,
    rating: lead?.rating || 'cold',
    budget: lead?.budget || '',
    timeline: lead?.timeline || '',
    decisionMaker: lead?.decisionMaker || false,
    interestedServices: lead?.interestedServices || [],
    estimatedValue: lead?.estimatedValue || '',
    painPoints: lead?.painPoints || [],
    preferredContactMethod: lead?.preferredContactMethod || 'email',
    bestTimeToContact: lead?.bestTimeToContact || '',
    notes: lead?.notes || '',
    tags: lead?.tags || [],
    assignedTo: lead?.assignedTo || '',
    address: {
      street: lead?.address?.street || '',
      city: lead?.address?.city || '',
      state: lead?.address?.state || '',
      postalCode: lead?.address?.postalCode || '',
      country: lead?.address?.country || 'Kenya'
    }
  });

  const [errors, setErrors] = useState({});
  const [currentPainPoint, setCurrentPainPoint] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  // Handle form field changes
  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle service selection
  const handleServiceChange = (service, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interestedServices: [...prev.interestedServices, service]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interestedServices: prev.interestedServices.filter(s => s !== service)
      }));
    }
  };

  // Add pain point
  const addPainPoint = () => {
    if (currentPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        painPoints: [...prev.painPoints, currentPainPoint.trim()]
      }));
      setCurrentPainPoint('');
    }
  };

  // Remove pain point
  const removePainPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== index)
    }));
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.estimatedValue && isNaN(parseFloat(formData.estimatedValue))) {
      newErrors.estimatedValue = 'Estimated value must be a valid number';
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

    const leadData = {
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      estimatedValue: parseFloat(formData.estimatedValue) || 0
    };

    try {
      let result;
      if (lead?.id) {
        result = await updateLead(lead.id, leadData);
      } else {
        result = await createLead(leadData);
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

  // Source options
  const sourceOptions = Object.values(LeadSources).map(source => ({
    value: source,
    label: source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Status options
  const statusOptions = Object.values(LeadStatus).map(status => ({
    value: status,
    label: status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  // Service options
  const serviceOptions = [
    'residential_move',
    'office_move',
    'international_move',
    'storage',
    'packing',
    'unpacking',
    'assembly',
    'cleaning'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {lead ? 'Edit Lead' : 'Create New Lead'}
            </h2>
            <p className="text-gray-600 mt-1">
              {lead ? 'Update lead information and track progress' : 'Add a new lead to your sales pipeline'}
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
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
            
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
            
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />
            
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
        </div>

        {/* Lead Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Source"
              options={sourceOptions}
              value={formData.source}
              onChange={(value) => handleChange('source', value)}
              required
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              required
            />
            
            <Select
              label="Rating"
              options={[
                { value: 'hot', label: 'Hot' },
                { value: 'warm', label: 'Warm' },
                { value: 'cold', label: 'Cold' }
              ]}
              value={formData.rating}
              onChange={(value) => handleChange('rating', value)}
              required
            />
          </div>
        </div>

        {/* Qualification Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Qualification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Budget (KSh)"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              error={errors.budget}
              min="0"
            />
            
            <Input
              label="Estimated Value (KSh)"
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => handleChange('estimatedValue', e.target.value)}
              error={errors.estimatedValue}
              min="0"
            />
            
            <Select
              label="Timeline"
              options={[
                { value: '', label: 'Select timeline' },
                { value: 'immediate', label: 'Immediate' },
                { value: '1_month', label: '1 Month' },
                { value: '3_months', label: '3 Months' },
                { value: '6_months', label: '6 Months' },
                { value: '1_year', label: '1 Year' }
              ]}
              value={formData.timeline}
              onChange={(value) => handleChange('timeline', value)}
            />
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.decisionMaker}
                  onChange={(e) => handleChange('decisionMaker', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Decision Maker</span>
              </label>
            </div>
          </div>
        </div>

        {/* Interested Services */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Interested Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.interestedServices.includes(service)}
                  onChange={(e) => handleServiceChange(service, e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pain Points</h3>
          <div className="flex items-center space-x-2 mb-3">
            <Input
              placeholder="Add a pain point..."
              value={currentPainPoint}
              onChange={(e) => setCurrentPainPoint(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
            />
            <Button
              type="button"
              variant="outline"
              iconName="Plus"
              onClick={addPainPoint}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.painPoints.map((painPoint, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
              >
                {painPoint}
                <button
                  type="button"
                  onClick={() => removePainPoint(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
          <div className="flex items-center space-x-2 mb-3">
            <Input
              placeholder="Add a tag..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button
              type="button"
              variant="outline"
              iconName="Plus"
              onClick={addTag}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Icon name="X" size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional notes about this lead..."
            rows={4}
          />
        </div>

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
            {lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
