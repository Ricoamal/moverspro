import React, { useState, useEffect } from 'react';
import { useCustomerAdvanced } from '../../../contexts/CustomerAdvancedContext';
import { CustomerTiers, LoyaltyProgramTiers } from '../../../types/customerAdvanced';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CustomerAnalytics = ({ customer }) => {
  const {
    customerAnalytics,
    customerInsights,
    customerJourney,
    refreshCustomerAnalytics,
    exportCustomerData,
    loading
  } = useCustomerAdvanced();

  const [refreshing, setRefreshing] = useState(false);

  // Refresh analytics when customer changes
  useEffect(() => {
    if (customer?.id) {
      handleRefreshAnalytics();
    }
  }, [customer?.id]);

  // Handle refresh analytics
  const handleRefreshAnalytics = async () => {
    if (!customer?.id) return;
    
    setRefreshing(true);
    try {
      await refreshCustomerAnalytics(customer.id);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export
  const handleExport = async (format) => {
    const result = await exportCustomerData(customer.id, format);
    if (!result.success) {
      alert(`Export failed: ${result.error}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Get tier color
  const getTierColor = (tier) => {
    switch (tier) {
      case CustomerTiers.PLATINUM:
        return 'text-purple-600 bg-purple-100';
      case CustomerTiers.GOLD:
        return 'text-yellow-600 bg-yellow-100';
      case CustomerTiers.SILVER:
        return 'text-gray-600 bg-gray-100';
      case CustomerTiers.BRONZE:
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  // Get risk color
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h3>
        <p className="text-gray-600">Select a customer to view their analytics and insights.</p>
      </div>
    );
  }

  if (loading && !customerAnalytics) {
    return (
      <div className="text-center py-12">
        <Icon name="Loader2" size={48} className="text-gray-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Analytics</h3>
        <p className="text-gray-600">Calculating customer insights and analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Customer Analytics</h2>
          <p className="text-gray-600 mt-1">
            Insights and analytics for {customer.name}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="RefreshCw"
            onClick={handleRefreshAnalytics}
            loading={refreshing}
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => handleExport('json')}
            size="sm"
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => handleExport('csv')}
            size="sm"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {customerAnalytics ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{customerAnalytics.totalServices}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(customerAnalytics.totalSpent)}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(customerAnalytics.averageOrderValue)}</div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{customerAnalytics.loyaltyPoints}</div>
              <div className="text-sm text-gray-600">Loyalty Points</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{customerAnalytics.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{customerAnalytics.daysSinceLastService}</div>
              <div className="text-sm text-gray-600">Days Since Last Service</div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loyalty Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Loyalty Status</h3>
                <Icon name="Award" size={24} className="text-yellow-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Tier</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customerAnalytics.loyaltyTier)}`}>
                    {customerAnalytics.loyaltyTier.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="text-sm font-medium text-gray-900">{customerAnalytics.loyaltyPoints}</span>
                </div>
                {customerAnalytics.loyaltyTier !== CustomerTiers.PLATINUM && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Progress to next tier</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (customerAnalytics.loyaltyPoints / 1000) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
                <Icon name="AlertTriangle" size={24} className="text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(customerAnalytics.riskScore)}`}>
                    {customerAnalytics.riskScore.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement Score</span>
                  <span className="text-sm font-medium text-gray-900">{customerAnalytics.engagementScore || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-medium text-gray-900">{customerAnalytics.daysSinceLastService} days ago</span>
                </div>
              </div>
            </div>

            {/* Communication Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                <Icon name="MessageSquare" size={24} className="text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Communications</span>
                  <span className="text-sm font-medium text-gray-900">{customerAnalytics.totalCommunications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {customerAnalytics.averageResponseTime > 0 
                      ? `${Math.round(customerAnalytics.averageResponseTime / 60)} hours`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preferred Channel</span>
                  <span className="text-sm font-medium text-gray-900">
                    {customerAnalytics.preferredChannel?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          {customerAnalytics.preferredServices && customerAnalytics.preferredServices.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customerAnalytics.preferredServices.slice(0, 3).map((service, index) => (
                  <div key={service} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Insights */}
          {customerInsights && (
            <div className="space-y-6">
              {/* Alerts */}
              {customerInsights.alerts && customerInsights.alerts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h3>
                  <div className="space-y-3">
                    {customerInsights.alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                        alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              alert.severity === 'high' ? 'text-red-800' :
                              alert.severity === 'medium' ? 'text-yellow-800' :
                              'text-blue-800'
                            }`}>
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(alert.triggeredAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {customerInsights.opportunities && customerInsights.opportunities.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Opportunities</h3>
                  <div className="space-y-3">
                    {customerInsights.opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">{opportunity.title}</p>
                            <p className="text-xs text-green-600 mt-1">{opportunity.description}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Estimated Value: {formatCurrency(opportunity.estimatedValue)} | 
                              Probability: {Math.round(opportunity.probability * 100)}%
                            </p>
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {opportunity.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {customerInsights.recommendations && customerInsights.recommendations.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {customerInsights.recommendations.map((recommendation) => (
                      <div key={recommendation.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">{recommendation.title}</p>
                            <p className="text-xs text-blue-600 mt-1">{recommendation.description}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Priority: {recommendation.priority} | Effort: {recommendation.effort}
                            </p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                            recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {recommendation.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
          <p className="text-gray-600 mb-4">Analytics will be generated once the customer has service history.</p>
          <Button
            iconName="RefreshCw"
            onClick={handleRefreshAnalytics}
            loading={refreshing}
          >
            Generate Analytics
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerAnalytics;
