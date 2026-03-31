import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ParameterFormProps {
  parameters: Record<string, any>;
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

function getFieldType(schema: any): 'string' | 'number' | 'boolean' | 'object' {
  if (!schema) return 'string';
  const type = schema.type || schema;
  if (type === 'number' || type === 'integer') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'object' || type === 'array') return 'object';
  return 'string';
}

const ParameterForm = ({ parameters, values, onChange }: ParameterFormProps) => {
  const entries = Object.entries(parameters);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        This tool has no parameters
      </p>
    );
  }

  const handleChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-4">
      {entries.map(([key, schema]) => {
        const fieldType = getFieldType(schema);
        const description = typeof schema === 'object' ? schema.description : undefined;
        const required = typeof schema === 'object' ? schema.required : false;

        return (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key} className="flex items-center gap-1">
              {key}
              {required && <span className="text-destructive">*</span>}
              <span className="text-xs text-muted-foreground ml-1">({fieldType})</span>
            </Label>

            {fieldType === 'boolean' ? (
              <Switch
                id={key}
                checked={!!values[key]}
                onCheckedChange={(checked) => handleChange(key, checked)}
              />
            ) : fieldType === 'number' ? (
              <Input
                id={key}
                type="number"
                value={values[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value ? Number(e.target.value) : undefined)}
                placeholder={description || `Enter ${key}`}
              />
            ) : fieldType === 'object' ? (
              <Textarea
                id={key}
                value={typeof values[key] === 'string' ? values[key] : JSON.stringify(values[key] || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleChange(key, JSON.parse(e.target.value));
                  } catch {
                    handleChange(key, e.target.value);
                  }
                }}
                placeholder={description || `JSON for ${key}`}
                rows={3}
                className="font-mono text-sm"
              />
            ) : (
              <Input
                id={key}
                value={values[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={description || `Enter ${key}`}
              />
            )}

            {description && fieldType !== 'object' && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParameterForm;
