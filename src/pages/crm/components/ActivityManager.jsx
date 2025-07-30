import React, { useState } from 'react';
import { useCRM } from '../../../contexts/CRMContext';
import { ActivityTypes } from '../../../types/crm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ActivityManager = ({ onBack }) => {
  const { activities, loading, createActivity } = useCRM();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    assignedTo: ''
  });

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filters.type && activity.type !== filters.type) return false;
    if (filters.status && activity.status !== filters.status) return false;
    if (filters.assignedTo && activity.assignedTo !== filters.assignedTo) return false;
    return true;
  });

  // Get activity type icon
  const getActivityIcon = (type) => {
    switch (type) {
      case ActivityTypes.CALL:
        return 'Phone';
      case ActivityTypes.EMAIL:
        return 'Mail';
      case ActivityTypes.MEETING:
        return 'Users';
      case ActivityTypes.TASK:
        return 'CheckSquare';
      case ActivityTypes.NOTE:
        return 'FileText';
      case ActivityTypes.QUOTE:
        return 'DollarSign';
      case ActivityTypes.PROPOSAL:
        return 'FileText';
      case ActivityTypes.FOLLOW_UP:
        return 'Clock';
      case ActivityTypes.DEMO:
        return 'Play';
      case ActivityTypes.SITE_VISIT:
        return 'MapPin';
      default:
        return 'Activity';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
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

  // Activity type options
  const typeOptions = Object.values(ActivityTypes).map(type => ({
    value: type,
    label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Activity Management</h2>
          <p className="text-gray-600 mt-1">
            Track and manage all sales activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Calendar"
            onClick={() => alert('Calendar view will be implemented')}
          >
            Calendar View
          </Button>
          <Button
            iconName="Plus"
            onClick={() => setShowCreateForm(true)}
          >
            New Activity
          </Button>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {activities.filter(a => a.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {activities.filter(a => 
                a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'completed'
              ).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Filter by Type"
            options={[{ value: '', label: 'All Types' }, ...typeOptions]}
            value={filters.type}
            onChange={(value) => handleFilterChange('type', value)}
          />
          
          <Select
            label="Filter by Status"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
          
          <Select
            label="Filter by Assignee"
            options={[
              { value: '', label: 'All Assignees' },
              { value: 'sales_rep_1', label: 'Sales Rep 1' },
              { value: 'sales_rep_2', label: 'Sales Rep 2' }
            ]}
            value={filters.assignedTo}
            onChange={(value) => handleFilterChange('assignedTo', value)}
          />
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ type: '', status: '', assignedTo: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="Activity" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No activities found</h3>
            <p className="text-gray-600 mb-4">
              {activities.length === 0 
                ? 'Create your first activity to start tracking sales tasks.'
                : 'No activities match your current filters.'
              }
            </p>
            {activities.length === 0 && (
              <Button
                iconName="Plus"
                onClick={() => setShowCreateForm(true)}
              >
                Create Activity
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon name={getActivityIcon(activity.type)} size={20} className="text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {activity.subject}
                        </h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(activity.priority)}`}>
                          {activity.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Icon name="Tag" size={16} className="mr-1" />
                          {activity.type.replace('_', ' ')}
                        </span>
                        {activity.scheduledDate && (
                          <span className="flex items-center">
                            <Icon name="Calendar" size={16} className="mr-1" />
                            {new Date(activity.scheduledDate).toLocaleDateString()}
                          </span>
                        )}
                        {activity.duration > 0 && (
                          <span className="flex items-center">
                            <Icon name="Clock" size={16} className="mr-1" />
                            {activity.duration} min
                          </span>
                        )}
                        {activity.assignedTo && (
                          <span className="flex items-center">
                            <Icon name="User" size={16} className="mr-1" />
                            {activity.assignedTo}
                          </span>
                        )}
                      </div>
                      
                      {activity.description && (
                        <p className="text-gray-700 mb-3">{activity.description}</p>
                      )}
                      
                      {activity.outcome && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-green-800 mb-1">Outcome:</div>
                          <div className="text-sm text-green-700">{activity.outcome}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {activity.status === 'scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Mark as in progress
                          alert('Mark as in progress functionality will be implemented');
                        }}
                      >
                        Start
                      </Button>
                    )}
                    
                    {activity.status === 'in_progress' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Mark as completed
                          alert('Mark as completed functionality will be implemented');
                        }}
                      >
                        Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                    />
                    
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

      {/* Quick Create Activity Form (Modal would be better) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Quick Create Activity</h3>
              <Button
                variant="ghost"
                iconName="X"
                onClick={() => setShowCreateForm(false)}
              />
            </div>
            
            <div className="space-y-4">
              <Select
                label="Type"
                options={typeOptions}
                value=""
                onChange={() => {}}
              />
              
              <Input
                label="Subject"
                placeholder="Activity subject..."
              />
              
              <Input
                label="Due Date"
                type="date"
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Create activity
                    setShowCreateForm(false);
                    alert('Activity creation will be implemented');
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityManager;
