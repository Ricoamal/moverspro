import React from 'react';
import { useCRM } from '../../../contexts/CRMContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CRMDashboard = ({ onCreateLead, onCreateOpportunity, onViewLeads, onViewOpportunities }) => {
  const {
    dashboardData,
    loading,
    error,
    loadDashboardData,
    clearError
  } = useCRM();

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading CRM Data</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearError}
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage leads, opportunities, and sales pipeline
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={loadDashboardData}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            iconName="Target"
            onClick={onCreateOpportunity}
          >
            New Opportunity
          </Button>
          <Button
            iconName="UserPlus"
            onClick={onCreateLead}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lead Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.leadMetrics.totalLeads}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon name="Users" size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">
                +{dashboardData.leadMetrics.newLeads}
              </span>
              <span className="text-gray-600 ml-1">new this month</span>
            </div>
          </div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.leadMetrics.qualifiedLeads}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icon name="UserCheck" size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-blue-600 font-medium">
                {formatPercentage((dashboardData.leadMetrics.qualifiedLeads / dashboardData.leadMetrics.totalLeads) * 100 || 0)}
              </span>
              <span className="text-gray-600 ml-1">qualification rate</span>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(dashboardData.leadMetrics.conversionRate)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icon name="TrendingUp" size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {dashboardData.leadMetrics.convertedLeads}
              </span>
              <span className="text-gray-600 ml-1">converted leads</span>
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.opportunityMetrics.totalValue)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icon name="DollarSign" size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className="text-blue-600 font-medium">
                {dashboardData.opportunityMetrics.totalOpportunities}
              </span>
              <span className="text-gray-600 ml-1">opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Lead Performance</h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={onViewLeads}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Total Leads</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{dashboardData.leadMetrics.totalLeads}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Qualified</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{dashboardData.leadMetrics.qualifiedLeads}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Converted</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{dashboardData.leadMetrics.convertedLeads}</span>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">{formatPercentage(dashboardData.leadMetrics.conversionRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Opportunity Performance</h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={onViewOpportunities}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Total Opportunities</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{dashboardData.opportunityMetrics.totalOpportunities}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Total Value</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(dashboardData.opportunityMetrics.totalValue)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Average Deal Size</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(dashboardData.opportunityMetrics.averageDealSize)}</span>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Win Rate</span>
                <span className="text-sm font-bold text-green-600">{formatPercentage(dashboardData.opportunityMetrics.winRate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{dashboardData.activityMetrics.totalActivities}</div>
            <div className="text-sm text-gray-600 mt-1">Total Activities</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{dashboardData.activityMetrics.completedActivities}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{dashboardData.activityMetrics.overdueActivities}</div>
            <div className="text-sm text-gray-600 mt-1">Overdue</div>
          </div>
        </div>
        
        {dashboardData.activityMetrics.overdueActivities > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Icon name="AlertTriangle" size={16} className="text-red-600 mr-2" />
              <span className="text-sm text-red-800">
                You have {dashboardData.activityMetrics.overdueActivities} overdue activities that need attention.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            iconName="UserPlus"
            onClick={onCreateLead}
            className="justify-start"
          >
            Add New Lead
          </Button>
          
          <Button
            variant="outline"
            iconName="Target"
            onClick={onCreateOpportunity}
            className="justify-start"
          >
            Create Opportunity
          </Button>
          
          <Button
            variant="outline"
            iconName="Users"
            onClick={onViewLeads}
            className="justify-start"
          >
            View All Leads
          </Button>
          
          <Button
            variant="outline"
            iconName="BarChart3"
            onClick={onViewOpportunities}
            className="justify-start"
          >
            View Pipeline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
