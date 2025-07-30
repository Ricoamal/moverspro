import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../../contexts/CustomerContext';
import { useCustomerAdvanced } from '../../../contexts/CustomerAdvancedContext';
import { CustomerStatus, CustomerTypes, MoveStatus } from '../../../types/customer';
import CustomerAnalytics from './CustomerAnalytics';
import CommunicationManager from './CommunicationManager';
import ServiceHistory from './ServiceHistory';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Icon from '../../../components/AppIcon';

const CustomerDetails = ({ customer, onEdit, onBack }) => {
  const { addMoveToHistory, addCommunication } = useCustomers();
  const { setCurrentCustomer } = useCustomerAdvanced();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMove, setShowAddMove] = useState(false);
  const [showAddCommunication, setShowAddCommunication] = useState(false);

  // Set current customer for advanced features
  useEffect(() => {
    if (customer?.id) {
      setCurrentCustomer(customer.id);
    }
    return () => {
      setCurrentCustomer(null);
    };
  }, [customer?.id, setCurrentCustomer]);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <Icon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h3>
        <p className="text-gray-600">Please select a customer to view details.</p>
      </div>
    );
  }

  const formatCustomerName = () => {
    return `${customer.personalInfo.firstName} ${customer.personalInfo.lastName}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case CustomerStatus.INACTIVE:
        return 'text-gray-600 bg-gray-100';
      case CustomerStatus.SUSPENDED:
        return 'text-red-600 bg-red-100';
      case CustomerStatus.PROSPECT:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum':
        return 'text-purple-600 bg-purple-100';
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'silver':
        return 'text-gray-600 bg-gray-100';
      case 'bronze':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMoveStatusColor = (status) => {
    switch (status) {
      case MoveStatus.COMPLETED:
        return 'text-green-600 bg-green-100';
      case MoveStatus.IN_PROGRESS:
        return 'text-blue-600 bg-blue-100';
      case MoveStatus.BOOKED:
        return 'text-purple-600 bg-purple-100';
      case MoveStatus.QUOTED:
        return 'text-yellow-600 bg-yellow-100';
      case MoveStatus.CANCELLED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'communications', label: 'Communications', icon: 'MessageSquare' },
    { id: 'services', label: 'Service History', icon: 'History' },
    { id: 'moves', label: 'Move History', icon: 'Truck' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'notes', label: 'Notes', icon: 'StickyNote' }
  ];

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-medium text-gray-700">
                {customer.personalInfo.firstName.charAt(0)}
                {customer.personalInfo.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formatCustomerName()}</h1>
              <p className="text-gray-600">{customer.customerNumber}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customer.segmentation.tier)}`}>
                  {customer.segmentation.tier}
                </span>
                <span className="text-sm text-gray-600">
                  {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Edit"
              onClick={() => onEdit(customer)}
            >
              Edit Customer
            </Button>
            <Button
              iconName="Plus"
              onClick={() => setShowAddMove(true)}
            >
              New Move
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{customer.moveHistory.length}</div>
            <div className="text-sm text-gray-600">Total Moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              KSh {customer.segmentation.lifetimeValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Lifetime Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{customer.segmentation.loyaltyPoints}</div>
            <div className="text-sm text-gray-600">Loyalty Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{customer.communications.length}</div>
            <div className="text-sm text-gray-600">Communications</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
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

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">
                        {customer.personalInfo.title} {formatCustomerName()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">
                        {customer.personalInfo.dateOfBirth 
                          ? new Date(customer.personalInfo.dateOfBirth).toLocaleDateString()
                          : 'Not provided'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{customer.personalInfo.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium">{customer.personalInfo.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Number:</span>
                      <span className="font-medium">{customer.personalInfo.idNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Phone:</span>
                      <span className="font-medium">{customer.contactInfo.primaryPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{customer.contactInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Secondary Phone:</span>
                      <span className="font-medium">{customer.contactInfo.secondaryPhone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp:</span>
                      <span className="font-medium">{customer.contactInfo.whatsappNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Contact:</span>
                      <span className="font-medium">{customer.contactInfo.preferredContactMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
                <div className="space-y-4">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
                        </span>
                        {address.isPrimary && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {address.street}
                        {address.apartment && `, ${address.apartment}`}
                        <br />
                        {address.city}, {address.state} {address.postalCode}
                        <br />
                        {address.country}
                      </p>
                      {address.accessInstructions && (
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Access Instructions:</strong> {address.accessInstructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Information */}
              {customer.type === CustomerTypes.CORPORATE && customer.corporateInfo.companyName && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Corporate Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Name:</span>
                        <span className="font-medium">{customer.corporateInfo.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Number:</span>
                        <span className="font-medium">{customer.corporateInfo.registrationNumber || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax Number:</span>
                        <span className="font-medium">{customer.corporateInfo.taxNumber || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Industry:</span>
                        <span className="font-medium">{customer.corporateInfo.industry || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Size:</span>
                        <span className="font-medium">{customer.corporateInfo.companySize || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Website:</span>
                        <span className="font-medium">{customer.corporateInfo.website || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <CustomerAnalytics customer={customer} />
          )}

          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <CommunicationManager customer={customer} />
          )}

          {/* Service History Tab */}
          {activeTab === 'services' && (
            <ServiceHistory customer={customer} />
          )}

          {/* Move History Tab */}
          {activeTab === 'moves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Move History</h3>
                <Button
                  iconName="Plus"
                  onClick={() => setShowAddMove(true)}
                >
                  Add Move
                </Button>
              </div>

              {customer.moveHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Truck" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Move History</h4>
                  <p className="text-gray-600 mb-4">This customer hasn't had any moves yet.</p>
                  <Button
                    iconName="Plus"
                    onClick={() => setShowAddMove(true)}
                  >
                    Add First Move
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.moveHistory.map((move, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{move.moveNumber || `Move #${index + 1}`}</h4>
                          <p className="text-sm text-gray-600">
                            {move.date ? new Date(move.date).toLocaleDateString() : 'Date not set'}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMoveStatusColor(move.status)}`}>
                          {move.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Service Type:</span>
                          <span className="ml-2 font-medium">{move.serviceType}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Final Cost:</span>
                          <span className="ml-2 font-medium">KSh {move.finalCost?.toLocaleString() || 'Not set'}</span>
                        </div>
                      </div>
                      
                      {move.origin?.address && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-600">From:</span>
                          <span className="ml-2">{move.origin.address}</span>
                        </div>
                      )}
                      
                      {move.destination?.address && (
                        <div className="text-sm">
                          <span className="text-gray-600">To:</span>
                          <span className="ml-2">{move.destination.address}</span>
                        </div>
                      )}
                      
                      {move.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">Feedback:</span>
                          <p className="text-sm mt-1">{move.feedback}</p>
                          {move.rating && (
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-gray-600 mr-2">Rating:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Icon
                                    key={star}
                                    name="Star"
                                    size={16}
                                    className={star <= move.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                <Button iconName="Upload">
                  Upload Document
                </Button>
              </div>

              {customer.documents.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Documents</h4>
                  <p className="text-gray-600 mb-4">No documents uploaded for this customer yet.</p>
                  <Button iconName="Upload">
                    Upload First Document
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customer.documents.map((doc, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon name="FileText" size={20} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Type: {doc.type}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Unknown'}
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                <Button iconName="Plus">
                  Add Note
                </Button>
              </div>

              {customer.notes.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="StickyNote" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Notes</h4>
                  <p className="text-gray-600 mb-4">No notes added for this customer yet.</p>
                  <Button iconName="Plus">
                    Add First Note
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.notes.map((note, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          note.type === 'important' ? 'bg-red-100 text-red-600' :
                          note.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          note.type === 'follow_up' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {note.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                      {note.createdBy && (
                        <p className="text-xs text-gray-500 mt-2">By: {note.createdBy}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
