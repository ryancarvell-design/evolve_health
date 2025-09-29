import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PropertiesPanel = ({ selectedElement, onElementUpdate, onElementDelete }) => {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-card border-l border-border h-full flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="Settings" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Element Selected</h3>
          <p className="text-sm text-muted-foreground">Click on an element in the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateProperty = (key, value) => {
    const updatedElement = {
      ...selectedElement,
      properties: {
        ...selectedElement?.properties,
        [key]: value
      }
    };
    onElementUpdate(updatedElement);
  };

  const updatePosition = (key, value) => {
    const updatedElement = {
      ...selectedElement,
      [key]: parseInt(value) || 0
    };
    onElementUpdate(updatedElement);
  };

  const renderBasicProperties = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="X Position"
          type="number"
          value={selectedElement?.x}
          onChange={(e) => updatePosition('x', e?.target?.value)}
        />
        <Input
          label="Y Position"
          type="number"
          value={selectedElement?.y}
          onChange={(e) => updatePosition('y', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Width"
          type="number"
          value={selectedElement?.width}
          onChange={(e) => updatePosition('width', e?.target?.value)}
        />
        <Input
          label="Height"
          type="number"
          value={selectedElement?.height}
          onChange={(e) => updatePosition('height', e?.target?.value)}
        />
      </div>
    </div>
  );

  const renderTypeSpecificProperties = () => {
    switch (selectedElement?.type) {
      case 'input': case'textarea':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <Input
              label="Placeholder"
              value={selectedElement?.properties?.placeholder || ''}
              onChange={(e) => updateProperty('placeholder', e?.target?.value)}
            />
            <Checkbox
              label="Required Field"
              checked={selectedElement?.properties?.required || false}
              onChange={(e) => updateProperty('required', e?.target?.checked)}
            />
            {selectedElement?.type === 'textarea' && (
              <Input
                label="Rows"
                type="number"
                value={selectedElement?.properties?.rows || 4}
                onChange={(e) => updateProperty('rows', parseInt(e?.target?.value))}
              />
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Value"
                type="number"
                value={selectedElement?.properties?.min || ''}
                onChange={(e) => updateProperty('min', e?.target?.value)}
              />
              <Input
                label="Max Value"
                type="number"
                value={selectedElement?.properties?.max || ''}
                onChange={(e) => updateProperty('max', e?.target?.value)}
              />
            </div>
            <Checkbox
              label="Required Field"
              checked={selectedElement?.properties?.required || false}
              onChange={(e) => updateProperty('required', e?.target?.checked)}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <Checkbox
              label="Default Checked"
              checked={selectedElement?.properties?.checked || false}
              onChange={(e) => updateProperty('checked', e?.target?.checked)}
            />
          </div>
        );

      case 'radio': case'select': case'checkbox-group':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Options</label>
              <div className="space-y-2">
                {(selectedElement?.properties?.options || [])?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...selectedElement?.properties?.options];
                        newOptions[index] = e?.target?.value;
                        updateProperty('options', newOptions);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newOptions = selectedElement?.properties?.options?.filter((_, i) => i !== index);
                        updateProperty('options', newOptions);
                      }}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(selectedElement?.properties?.options || []), `Option ${(selectedElement?.properties?.options || [])?.length + 1}`];
                    updateProperty('options', newOptions);
                  }}
                  className="w-full"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          </div>
        );

      case 'pain-scale':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Value"
                type="number"
                value={selectedElement?.properties?.min || 1}
                onChange={(e) => updateProperty('min', parseInt(e?.target?.value))}
              />
              <Input
                label="Max Value"
                type="number"
                value={selectedElement?.properties?.max || 10}
                onChange={(e) => updateProperty('max', parseInt(e?.target?.value))}
              />
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-4">
            <Input
              label="Label"
              value={selectedElement?.properties?.label || ''}
              onChange={(e) => updateProperty('label', e?.target?.value)}
            />
            <Checkbox
              label="Required Signature"
              checked={selectedElement?.properties?.required || false}
              onChange={(e) => updateProperty('required', e?.target?.checked)}
            />
          </div>
        );

      case 'header':
        return (
          <div className="space-y-4">
            <Input
              label="Header Text"
              value={selectedElement?.properties?.text || ''}
              onChange={(e) => updateProperty('text', e?.target?.value)}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Header Level</label>
              <select
                value={selectedElement?.properties?.level || 2}
                onChange={(e) => updateProperty('level', parseInt(e?.target?.value))}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={1}>H1 - Main Title</option>
                <option value={2}>H2 - Section Header</option>
                <option value={3}>H3 - Subsection</option>
                <option value={4}>H4 - Minor Header</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon name="Settings" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No specific properties available for this element type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Properties</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onElementDelete(selectedElement?.id)}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={selectedElement?.icon} size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">{selectedElement?.name}</span>
        </div>
      </div>
      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Position & Size */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Move" size={16} className="mr-2" />
            Position & Size
          </h3>
          {renderBasicProperties()}
        </div>

        {/* Element Properties */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Settings" size={16} className="mr-2" />
            Element Properties
          </h3>
          {renderTypeSpecificProperties()}
        </div>

        {/* Validation Rules */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2" />
            Validation & Compliance
          </h3>
          <div className="space-y-3">
            <Checkbox
              label="HIPAA Compliant Field"
              checked={selectedElement?.properties?.hipaaCompliant || false}
              onChange={(e) => updateProperty('hipaaCompliant', e?.target?.checked)}
            />
            <Checkbox
              label="Include in Audit Trail"
              checked={selectedElement?.properties?.auditTrail || false}
              onChange={(e) => updateProperty('auditTrail', e?.target?.checked)}
            />
            <Input
              label="Validation Message"
              value={selectedElement?.properties?.validationMessage || ''}
              onChange={(e) => updateProperty('validationMessage', e?.target?.value)}
              placeholder="Custom validation error message"
            />
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" className="w-full">
          <Icon name="Copy" size={16} className="mr-2" />
          Duplicate Element
        </Button>
        <Button variant="ghost" className="w-full">
          <Icon name="Code" size={16} className="mr-2" />
          View HTML
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;