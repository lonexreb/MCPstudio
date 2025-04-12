
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReturnType } from '@/types/mcp';

interface ReturnTypeEditorProps {
  returnType: ReturnType;
  onChange: (returnType: ReturnType) => void;
}

const ReturnTypeEditor = ({ returnType, onChange }: ReturnTypeEditorProps) => {
  const handleChange = (field: keyof ReturnType, value: any) => {
    onChange({
      ...returnType,
      [field]: value
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="return-type">Return Type</Label>
        <Select 
          value={returnType.type} 
          onValueChange={(value) => handleChange('type', value)}
        >
          <SelectTrigger id="return-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="object">Object</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="null">Null</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="return-desc">Description</Label>
        <Textarea
          id="return-desc"
          placeholder="Describe the return value"
          value={returnType.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default ReturnTypeEditor;
