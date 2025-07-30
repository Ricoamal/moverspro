import React, { useState } from 'react';
import { useCustomerAdvanced } from '../../../contexts/CustomerAdvancedContext';
import { ServiceCategories, ServiceStatus } from '../../../types/customerAdvanced';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ServiceHistory = ({ customer }) => {
  const {
    serviceHistory,
    createServiceRecord,
    loading
  } = useCustomerAdvanced();

  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    category: ServiceCategories.RESIDENTIAL_MOVE,
    title: '',
    description: '',
    status: ServiceStatus.QUOTED,
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: '',
    quotedAmount: '',
    origin: {
      address: '',
      contactPerson: { name: '', phone: '' }
    },
    destination: {
      address: '',
      contactPerson: { name: '', phone: '' }
    },
    specialRequirements: '',
    estimatedDuration: ''
  });

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    year: new Date().getFullYear().toString()
  });

  // Handle form field changes
  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      } else if (parts.length === 3) {
        const [parent, middle, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [middle]: {
              ...prev[parent][middle],
              [child]: value
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customer?.id) {
      alert('Please select a customer first');
      return;
    }

    const serviceData = {
      ...formData,
      customerId: customer.id,
      quotedAmount: parseFloat(formData.quotedAmount) || 0,
      estimatedDuration: parseFloat(formData.estimatedDuration) || 0
    };

    const result = await createServiceRecord(serviceData);
    
    if (result.success) {
      setShowNewForm(false);
      // Reset form
      setFormData({
        category: ServiceCategories.RESIDENTIAL_MOVE,
        title: '',
        description: '',
        status: ServiceStatus.QUOTED,
        requestDate: new Date().toISOString().split('T')[0],
        scheduledDate: '',
        quotedAmount: '',
        origin: {
          address: '',
          contactPerson: { name: '', phone: '' }
        },
        destination: {
          address: '',
          contactPerson: { name: '', phone: '' }
        },
        specialRequirements: '',
        estimatedDuration: ''
      });
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Filter service history
  const filteredServices = serviceHistory.filter(service => {
    if (filters.category && service.category !== filters.category) return false;
    if (filters.status && service.status !== filters.status) return false;
    if (filters.year && new Date(service.requestDate).getFullYear().toString() !== filters.year) return false;
    return true;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case ServiceStatus.QUOTED:
        return 'text-blue-600 bg-blue-100';
      case ServiceStatus.BOOKED:
        return 'text-purple-600 bg-purple-100';
      case ServiceStatus.CONFIRMED:
        return 'text-indigo-600 bg-indigo-100';
      case ServiceStatus.IN_PROGRESS:
        return 'text-yellow-600 bg-yellow-100';
      case ServiceStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case ServiceStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
      case ServiceStatus.RESCHEDULED:
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Service category options
  const categoryOptions = Object.values(ServiceCategories).map(category => ({
    value: category,
    label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Service status options
  const statusOptions = Object.values(ServiceStatus).map(status => ({
    value: status,
    label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  if (!customer) {
    return (
      <div className="text-center py-12">
        <Icon name="History" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h3>
        <p className="text-gray-600">Select a customer to view their service history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Service History</h2>
          <p className="text-gray-600 mt-1">
            Complete service history for {customer.name}
          </p>
        </div>
        <Button
          iconName="Plus"
          onClick={() => setShowNewForm(true)}
        >
          New Service Record
        </Button>
      </div>

      {/* New Service Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">New Service Record</h3>
            <Button
              variant="ghost"
              iconName="X"
              onClick={() => setShowNewForm(false)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Service Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                required
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
                required
              />
              
              <Input
                label="Quoted Amount (KSh)"
                type="number"
                value={formData.quotedAmount}
                onChange={(e) => handleChange('quotedAmount', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <Input
              label="Service Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Brief description of the service..."
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed service description..."
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Request Date"
                type="date"
                value={formData.requestDate}
                onChange={(e) => handleChange('requestDate', e.target.value)}
                required
              />
              
              <Input
                label="Scheduled Date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Origin Location</h4>
                <Input
                  label="Address"
                  value={formData.origin.address}
                  onChange={(e) => handleChange('origin.address', e.target.value)}
                  placeholder="Origin address..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Contact Name"
                    value={formData.origin.contactPerson.name}
                    onChange={(e) => handleChange('origin.contactPerson.name', e.target.value)}
                    placeholder="Contact name"
                  />
                  <Input
                    label="Contact Phone"
                    value={formData.origin.contactPerson.phone}
                    onChange={(e) => handleChange('origin.contactPerson.phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Destination Location</h4>
                <Input
                  label="Address"
                  value={formData.destination.address}
                  onChange={(e) => handleChange('destination.address', e.target.value)}
                  placeholder="Destination address..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Contact Name"
                    value={formData.destination.contactPerson.name}
                    onChange={(e) => handleChange('destination.contactPerson.name', e.target.value)}
                    placeholder="Contact name"
                  />
                  <Input
                    label="Contact Phone"
                    value={formData.destination.contactPerson.phone}
                    onChange={(e) => handleChange('destination.contactPerson.phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estimated Duration (hours)"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            <Textarea
              label="Special Requirements"
              value={formData.specialRequirements}
              onChange={(e) => handleChange('specialRequirements', e.target.value)}
              placeholder="Any special requirements or notes..."
              rows={2}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                iconName="Save"
              >
                Create Service Record
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Filter by Category"
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            value={filters.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          />
          
          <Select
            label="Filter by Status"
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          />
          
          <Select
            label="Filter by Year"
            options={[
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' }
            ]}
            value={filters.year}
            onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ category: '', status: '', year: new Date().getFullYear().toString() })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Service History List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading service history...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="History" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Records Found</h3>
            <p className="text-gray-600 mb-4">
              {serviceHistory.length === 0 
                ? 'Start by creating the first service record for this customer.'
                : 'No service records match your current filters.'
              }
            </p>
            {serviceHistory.length === 0 && (
              <Button
                iconName="Plus"
                onClick={() => setShowNewForm(true)}
              >
                Create First Service Record
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {service.title}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                        {service.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {service.serviceNumber && (
                        <span className="text-sm text-gray-500">#{service.serviceNumber}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Icon name="Calendar" size={16} className="mr-1" />
                        {new Date(service.requestDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Tag" size={16} className="mr-1" />
                        {service.category.replace('_', ' ')}
                      </span>
                      {service.quotedAmount > 0 && (
                        <span className="flex items-center">
                          <Icon name="DollarSign" size={16} className="mr-1" />
                          {formatCurrency(service.quotedAmount)}
                        </span>
                      )}
                      {service.estimatedDuration > 0 && (
                        <span className="flex items-center">
                          <Icon name="Clock" size={16} className="mr-1" />
                          {service.estimatedDuration}h
                        </span>
                      )}
                    </div>
                    
                    {service.description && (
                      <p className="text-gray-700 mb-3">{service.description}</p>
                    )}
                    
                    {(service.origin.address || service.destination.address) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {service.origin.address && (
                          <div>
                            <strong>From:</strong> {service.origin.address}
                          </div>
                        )}
                        {service.destination.address && (
                          <div>
                            <strong>To:</strong> {service.destination.address}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {service.specialRequirements && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Special Requirements:</strong> {service.specialRequirements}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;
