import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PricingBreakdown = ({ quote, onPriceUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPricing, setEditedPricing] = useState(quote.pricingBreakdown);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = (pricing) => {
    return pricing.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleSave = () => {
    const newTotal = calculateTotal(editedPricing);
    onPriceUpdate({
      ...quote,
      pricingBreakdown: editedPricing,
      estimatedValue: newTotal
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPricing(quote.pricingBreakdown);
    setIsEditing(false);
  };

  const updatePricingItem = (index, field, value) => {
    const updated = [...editedPricing];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    };
    setEditedPricing(updated);
  };

  const addPricingItem = () => {
    setEditedPricing([
      ...editedPricing,
      {
        id: Date.now(),
        description: 'New Item',
        quantity: 1,
        unitPrice: 0,
        category: 'additional'
      }
    ]);
  };

  const removePricingItem = (index) => {
    const updated = editedPricing.filter((_, i) => i !== index);
    setEditedPricing(updated);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'base': 'Truck',
      'distance': 'Route',
      'rooms': 'Home',
      'additional': 'Plus',
      'insurance': 'Shield',
      'storage': 'Archive'
    };
    return icons[category] || 'DollarSign';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'base': 'text-blue-600',
      'distance': 'text-green-600',
      'rooms': 'text-purple-600',
      'additional': 'text-orange-600',
      'insurance': 'text-red-600',
      'storage': 'text-gray-600'
    };
    return colors[category] || 'text-gray-600';
  };

  const currentPricing = isEditing ? editedPricing : quote.pricingBreakdown;
  const currentTotal = calculateTotal(currentPricing);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="Calculator" size={20} className="mr-2" />
          Pricing Breakdown
        </h2>
        
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Pricing
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              iconName="Check"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {currentPricing.map((item, index) => (
          <div key={item.id || index} className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-lg bg-white mr-4 ${getCategoryColor(item.category)}`}>
              <Icon name={getCategoryIcon(item.category)} size={16} />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {isEditing ? (
                <>
                  <Input
                    value={item.description}
                    onChange={(e) => updatePricingItem(index, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updatePricingItem(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    min="0"
                    step="0.1"
                  />
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updatePricingItem(index, 'unitPrice', e.target.value)}
                    placeholder="Unit price"
                    min="0"
                    step="1"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePricingItem(index)}
                      iconName="Trash2"
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(item.unitPrice)} per unit
                  </div>
                  <div className="font-medium text-gray-900 text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {isEditing && (
          <Button
            variant="outline"
            onClick={addPricingItem}
            iconName="Plus"
            iconPosition="left"
            className="w-full"
          >
            Add Item
          </Button>
        )}
      </div>

      {/* Total Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Total Estimated Cost</p>
            <p className="text-sm text-gray-500">Including all services and fees</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(currentTotal)}
            </p>
            {isEditing && currentTotal !== quote.estimatedValue && (
              <p className="text-sm text-amber-600">
                Original: {formatCurrency(quote.estimatedValue)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Route Factors */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Route-Specific Factors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icon name="Route" size={16} className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Distance</span>
            </div>
            <p className="text-sm text-gray-600">{quote.distance} km</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icon name="Clock" size={16} className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Est. Duration</span>
            </div>
            <p className="text-sm text-gray-600">{quote.estimatedDuration} hours</p>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center mb-1">
              <Icon name="AlertTriangle" size={16} className="text-amber-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Difficulty</span>
            </div>
            <p className="text-sm text-gray-600 capitalize">{quote.accessDifficulty}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;