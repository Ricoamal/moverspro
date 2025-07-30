import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Textarea from '../../../../components/ui/Textarea';

const ContactForm = ({ block, content, isSelected, isEditing, deviceMode, onUpdate }) => {
  const {
    title = 'Get Your Free Quote',
    subtitle = 'Fill out the form below and we\'ll get back to you within 24 hours',
    fields = [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { 
        name: 'service', 
        label: 'Service Type', 
        type: 'select', 
        required: true, 
        options: ['Residential Move', 'Office Move', 'Storage', 'Packing'] 
      },
      { name: 'message', label: 'Additional Details', type: 'textarea', required: false }
    ],
    submitButton = {
      text: 'Get Free Quote',
      style: 'primary'
    },
    successMessage = 'Thank you! We\'ll contact you within 24 hours.',
    errorMessage = 'Sorry, there was an error. Please try again.'
  } = content;

  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

  const handleContentChange = (field, value) => {
    if (onUpdate) {
      onUpdate(block.id, {
        content: {
          ...content,
          [field]: value
        }
      });
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    handleContentChange('fields', updatedFields);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addField = () => {
    const newField = {
      name: `field_${fields.length + 1}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    handleContentChange('fields', [...fields, newField]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    handleContentChange('fields', updatedFields);
  };

  const renderField = (field, index) => {
    const commonProps = {
      key: field.name,
      label: field.label + (field.required ? ' *' : ''),
      value: formData[field.name] || '',
      onChange: (value) => handleInputChange(field.name, value),
      required: field.required,
      disabled: isSubmitting
    };

    switch (field.type) {
      case 'select':
        return (
          <div className="relative">
            <Select
              {...commonProps}
              options={[
                { value: '', label: `Select ${field.label}` },
                ...(field.options || []).map(option => ({ value: option, label: option }))
              ]}
            />
            {isEditing && (
              <button
                onClick={() => removeField(index)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs transform translate-x-2 -translate-y-2"
              >
                ×
              </button>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="relative">
            <Textarea
              {...commonProps}
              rows={4}
            />
            {isEditing && (
              <button
                onClick={() => removeField(index)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs transform translate-x-2 -translate-y-2"
              >
                ×
              </button>
            )}
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <Input
              {...commonProps}
              type={field.type}
            />
            {isEditing && (
              <button
                onClick={() => removeField(index)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs transform translate-x-2 -translate-y-2"
              >
                ×
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${
              isEditing ? 'cursor-text' : ''
            }`}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleContentChange('title', e.target.textContent)}
          >
            {title}
          </h2>
          
          {subtitle && (
            <p
              className={`text-lg text-gray-600 ${isEditing ? 'cursor-text' : ''}`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange('subtitle', e.target.textContent)}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">{successMessage}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSubmitStatus(null)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                  <div
                    key={field.name}
                    className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                  >
                    {renderField(field, index)}
                    
                    {/* Field Editor (Editing Mode) */}
                    {isEditing && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Field Label"
                            value={field.label}
                            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="select">Select</option>
                            <option value="textarea">Textarea</option>
                          </select>
                        </div>
                        <label className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                            className="mr-2"
                          />
                          Required
                        </label>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Field Button (Editing Mode) */}
                {isEditing && (
                  <div className="md:col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={addField}
                      className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Field
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting || isEditing}
                  className="px-8"
                >
                  {isSubmitting ? 'Sending...' : submitButton.text}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Editing Overlay */}
      {isSelected && isEditing && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <div className="text-sm font-medium text-gray-900 mb-2">Contact Form Settings</div>
          <div className="space-y-2 text-xs text-gray-600">
            <div>• Click text to edit content</div>
            <div>• Edit field labels and types</div>
            <div>• Add/remove form fields</div>
            <div>• Toggle required fields</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;
