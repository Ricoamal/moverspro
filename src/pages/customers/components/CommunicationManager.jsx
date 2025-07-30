import React, { useState } from 'react';
import { useCustomerAdvanced } from '../../../contexts/CustomerAdvancedContext';
import { 
  CommunicationTypes, 
  CommunicationChannels, 
  CommunicationStatus 
} from '../../../types/customerAdvanced';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CommunicationManager = ({ customer }) => {
  const {
    communications,
    createCommunication,
    updateCommunicationStatus,
    loading
  } = useCustomerAdvanced();

  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    type: CommunicationTypes.INQUIRY,
    channel: CommunicationChannels.EMAIL,
    direction: 'inbound',
    subject: '',
    content: '',
    priority: 'medium',
    responseRequired: true,
    contactPerson: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      role: 'Primary Contact'
    }
  });

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    channel: ''
  });

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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customer?.id) {
      alert('Please select a customer first');
      return;
    }

    const communicationData = {
      ...formData,
      customerId: customer.id
    };

    const result = await createCommunication(communicationData);
    
    if (result.success) {
      setShowNewForm(false);
      setFormData({
        type: CommunicationTypes.INQUIRY,
        channel: CommunicationChannels.EMAIL,
        direction: 'inbound',
        subject: '',
        content: '',
        priority: 'medium',
        responseRequired: true,
        contactPerson: {
          name: customer?.name || '',
          email: customer?.email || '',
          phone: customer?.phone || '',
          role: 'Primary Contact'
        }
      });
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (communicationId, newStatus) => {
    const result = await updateCommunicationStatus(communicationId, newStatus);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
  };

  // Filter communications
  const filteredCommunications = communications.filter(comm => {
    if (filters.type && comm.type !== filters.type) return false;
    if (filters.status && comm.status !== filters.status) return false;
    if (filters.channel && comm.channel !== filters.channel) return false;
    return true;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case CommunicationStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case CommunicationStatus.IN_PROGRESS:
        return 'text-blue-600 bg-blue-100';
      case CommunicationStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case CommunicationStatus.ESCALATED:
        return 'text-red-600 bg-red-100';
      case CommunicationStatus.CLOSED:
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Communication type options
  const typeOptions = Object.values(CommunicationTypes).map(type => ({
    value: type,
    label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Communication channel options
  const channelOptions = Object.values(CommunicationChannels).map(channel => ({
    value: channel,
    label: channel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Status options
  const statusOptions = Object.values(CommunicationStatus).map(status => ({
    value: status,
    label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  if (!customer) {
    return (
      <div className="text-center py-12">
        <Icon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h3>
        <p className="text-gray-600">Select a customer to view and manage communications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
          <p className="text-gray-600 mt-1">
            Manage all communications with {customer.name}
          </p>
        </div>
        <Button
          iconName="Plus"
          onClick={() => setShowNewForm(true)}
        >
          New Communication
        </Button>
      </div>

      {/* New Communication Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">New Communication</h3>
            <Button
              variant="ghost"
              iconName="X"
              onClick={() => setShowNewForm(false)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Type"
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleChange('type', value)}
                required
              />
              
              <Select
                label="Channel"
                options={channelOptions}
                value={formData.channel}
                onChange={(value) => handleChange('channel', value)}
                required
              />
              
              <Select
                label="Priority"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' }
                ]}
                value={formData.priority}
                onChange={(value) => handleChange('priority', value)}
                required
              />
            </div>

            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Communication subject..."
              required
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Communication details..."
              rows={4}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Person"
                value={formData.contactPerson.name}
                onChange={(e) => handleChange('contactPerson.name', e.target.value)}
                placeholder="Contact person name"
              />
              
              <Input
                label="Contact Email"
                type="email"
                value={formData.contactPerson.email}
                onChange={(e) => handleChange('contactPerson.email', e.target.value)}
                placeholder="Contact email"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.responseRequired}
                  onChange={(e) => handleChange('responseRequired', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Response Required</span>
              </label>
            </div>

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
                iconName="Send"
              >
                Create Communication
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Filter by Type"
            options={[{ value: '', label: 'All Types' }, ...typeOptions]}
            value={filters.type}
            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          />
          
          <Select
            label="Filter by Status"
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          />
          
          <Select
            label="Filter by Channel"
            options={[{ value: '', label: 'All Channels' }, ...channelOptions]}
            value={filters.channel}
            onChange={(value) => setFilters(prev => ({ ...prev, channel: value }))}
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ type: '', status: '', channel: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Communications List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading communications...</p>
          </div>
        ) : filteredCommunications.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Communications Found</h3>
            <p className="text-gray-600 mb-4">
              {communications.length === 0 
                ? 'Start by creating the first communication with this customer.'
                : 'No communications match your current filters.'
              }
            </p>
            {communications.length === 0 && (
              <Button
                iconName="Plus"
                onClick={() => setShowNewForm(true)}
              >
                Create First Communication
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCommunications.map((communication) => (
              <div key={communication.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {communication.subject}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(communication.status)}`}>
                        {communication.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(communication.priority)}`}>
                        {communication.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Icon name="Calendar" size={16} className="mr-1" />
                        {new Date(communication.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Icon name="MessageSquare" size={16} className="mr-1" />
                        {communication.channel.replace('_', ' ')}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Tag" size={16} className="mr-1" />
                        {communication.type.replace('_', ' ')}
                      </span>
                      <span className="flex items-center">
                        <Icon name={communication.direction === 'inbound' ? 'ArrowDown' : 'ArrowUp'} size={16} className="mr-1" />
                        {communication.direction}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{communication.content}</p>
                    
                    {communication.contactPerson.name && (
                      <div className="text-sm text-gray-600">
                        <strong>Contact:</strong> {communication.contactPerson.name}
                        {communication.contactPerson.email && ` (${communication.contactPerson.email})`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {communication.status === CommunicationStatus.PENDING && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(communication.id, CommunicationStatus.IN_PROGRESS)}
                      >
                        Start
                      </Button>
                    )}
                    
                    {communication.status === CommunicationStatus.IN_PROGRESS && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(communication.id, CommunicationStatus.COMPLETED)}
                      >
                        Complete
                      </Button>
                    )}
                    
                    {communication.status === CommunicationStatus.COMPLETED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(communication.id, CommunicationStatus.CLOSED)}
                      >
                        Close
                      </Button>
                    )}
                    
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

export default CommunicationManager;
