
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Parameter } from '@/types/mcp';

interface ParameterEditorProps {
  parameter: Parameter;
  onChange: (parameter: Parameter) => void;
}

const ParameterEditor = ({ parameter, onChange }: ParameterEditorProps) => {
  const handleChange = (field: keyof Parameter, value: any) => {
    onChange({
      ...parameter,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="param-name">Name</Label>
          <Input
            id="param-name"
            placeholder="e.g., query, userId"
            value={parameter.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="param-type">Type</Label>
          <Select 
            value={parameter.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="param-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
              <SelectItem value="array">Array</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="param-desc">Description</Label>
        <Textarea
          id="param-desc"
          placeholder="Describe this parameter"
          value={parameter.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="param-required"
          checked={parameter.required}
          onCheckedChange={(checked) => handleChange('required', checked)}
        />
        <Label htmlFor="param-required">Required parameter</Label>
      </div>
    </div>
  );
};

export default ParameterEditor;
