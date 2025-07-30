import React from 'react';
import { useCRM } from '../../../contexts/CRMContext';
import { OpportunityStages } from '../../../types/crm';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OpportunityPipeline = ({ onCreateOpportunity, onBack }) => {
  const { opportunities, loading } = useCRM();

  // Group opportunities by stage
  const opportunitiesByStage = opportunities.reduce((acc, opp) => {
    if (!acc[opp.stage]) {
      acc[opp.stage] = [];
    }
    acc[opp.stage].push(opp);
    return acc;
  }, {});

  // Format currency
  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  // Get stage color
  const getStageColor = (stage) => {
    switch (stage) {
      case OpportunityStages.PROSPECTING:
        return 'bg-blue-100 text-blue-800';
      case OpportunityStages.QUALIFICATION:
        return 'bg-yellow-100 text-yellow-800';
      case OpportunityStages.NEEDS_ANALYSIS:
        return 'bg-purple-100 text-purple-800';
      case OpportunityStages.PROPOSAL:
        return 'bg-indigo-100 text-indigo-800';
      case OpportunityStages.NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case OpportunityStages.CLOSED_WON:
        return 'bg-green-100 text-green-800';
      case OpportunityStages.CLOSED_LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stages = [
    { key: OpportunityStages.PROSPECTING, label: 'Prospecting' },
    { key: OpportunityStages.QUALIFICATION, label: 'Qualification' },
    { key: OpportunityStages.NEEDS_ANALYSIS, label: 'Needs Analysis' },
    { key: OpportunityStages.PROPOSAL, label: 'Proposal' },
    { key: OpportunityStages.NEGOTIATION, label: 'Negotiation' },
    { key: OpportunityStages.CLOSED_WON, label: 'Closed Won' },
    { key: OpportunityStages.CLOSED_LOST, label: 'Closed Lost' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
          <p className="text-gray-600 mt-1">
            Track opportunities through your sales process
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => alert('Pipeline export will be implemented')}
          >
            Export
          </Button>
          <Button
            iconName="Plus"
            onClick={onCreateOpportunity}
          >
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{opportunities.length}</div>
            <div className="text-sm text-gray-600">Total Opportunities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.amount, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.amount, 0) / opportunities.length : 0)}
            </div>
            <div className="text-sm text-gray-600">Avg Deal Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {opportunities.filter(opp => opp.stage === OpportunityStages.CLOSED_WON).length}
            </div>
            <div className="text-sm text-gray-600">Won Deals</div>
          </div>
        </div>
      </div>

      {/* Pipeline Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {stages.map((stage) => {
            const stageOpportunities = opportunitiesByStage[stage.key] || [];
            const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
            
            return (
              <div key={stage.key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{stage.label}</h4>
                  <span className="text-sm text-gray-500">({stageOpportunities.length})</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  {formatCurrency(stageValue)}
                </div>
                
                <div className="space-y-3">
                  {stageOpportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-sm"
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {opportunity.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {formatCurrency(opportunity.amount)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                          {opportunity.probability}%
                        </span>
                        <div className="text-xs text-gray-500">
                          {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageOpportunities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Icon name="Target" size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No opportunities</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Opportunities</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Close Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Icon name="Loader2" size={24} className="animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Loading opportunities...</p>
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Icon name="Target" size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
                    <p className="text-gray-600 mb-4">Create your first opportunity to start tracking deals.</p>
                    <Button
                      iconName="Plus"
                      onClick={onCreateOpportunity}
                    >
                      Create Opportunity
                    </Button>
                  </td>
                </tr>
              ) : (
                opportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{opportunity.name}</div>
                        <div className="text-sm text-gray-500">{opportunity.serviceType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(opportunity.stage)}`}>
                        {opportunity.stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(opportunity.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{opportunity.probability}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${opportunity.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {opportunity.expectedCloseDate ? new Date(opportunity.expectedCloseDate).toLocaleDateString() : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpportunityPipeline;
