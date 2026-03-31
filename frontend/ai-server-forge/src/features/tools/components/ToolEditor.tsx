import React, { useState } from 'react';
import { 
  Wrench,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tool, Parameter, ReturnType } from '@/types/mcp';
import ParameterEditor from './ParameterEditor';
import ReturnTypeEditor from './ReturnTypeEditor';
import CodeEditor from './CodeEditor';

interface ToolEditorProps {
  tool?: Tool;
  onSave?: (tool: Tool) => void;
  isNew?: boolean;
}

const ToolEditor = ({ tool, onSave, isNew = false }: ToolEditorProps) => {
  const [name, setName] = useState(tool?.name || '');
  const [description, setDescription] = useState(tool?.description || '');
  const [parameters, setParameters] = useState<Parameter[]>(tool?.parameters || []);
  const [returnType, setReturnType] = useState<ReturnType>(tool?.returnType || { 
    type: 'object', 
    description: 'Response object' 
  });
  const [implementation, setImplementation] = useState(tool?.implementation || 
    `async function ${name || 'myFunction'}(${parameters.map(p => p.name).join(', ')}) {
  // Implement your function logic here
  
  return {
    // Return value
  };
}`);

  const handleAddParameter = () => {
    setParameters([
      ...parameters,
      {
        name: '',
        description: '',
        type: 'string',
        required: false
      }
    ]);
  };
  
  const handleUpdateParameter = (index: number, updatedParam: Parameter) => {
    const newParams = [...parameters];
    newParams[index] = updatedParam;
    setParameters(newParams);
  };
  
  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    if (!onSave) return;
    
    const updatedTool: Tool = {
      id: tool?.id || `tool-${Date.now()}`,
      name,
      description,
      parameters,
      returnType,
      implementation
    };
    
    onSave(updatedTool);
  };
  
  React.useEffect(() => {
    const paramList = parameters.map(p => p.name).filter(Boolean).join(', ');
    const functionPattern = new RegExp(`function\\s+${name || '[\\w_$]+'}\\s*\\([^)]*\\)`);
    
    if (name && implementation) {
      const updatedImplementation = implementation.replace(
        functionPattern,
        `function ${name}(${paramList})`
      );
      if (updatedImplementation !== implementation) {
        setImplementation(updatedImplementation);
      }
    }
  }, [name, parameters, implementation]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{isNew ? 'Create New Tool' : 'Edit Tool'}</h2>
            <p className="text-sm text-muted-foreground">Define capabilities for AI agent interaction</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Tool
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tool Name</Label>
                <Input 
                  id="name"
                  placeholder="e.g., getWeather, searchDocuments"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use camelCase without spaces, e.g., "searchDocuments"
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this tool does and when to use it"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Clear description helps AI agents understand when to use this tool
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Parameters</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddParameter}>
                <Plus className="h-4 w-4 mr-1" /> Add Parameter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {parameters.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">
                    No parameters defined yet. Add parameters to allow input to this tool.
                  </p>
                </div>
              ) : parameters.map((param, index) => (
                <div key={index} className="border rounded-md p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleRemoveParameter(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                  <ParameterEditor
                    parameter={param}
                    onChange={(updatedParam) => handleUpdateParameter(index, updatedParam)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Return Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ReturnTypeEditor
                returnType={returnType}
                onChange={setReturnType}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={implementation}
              onChange={setImplementation}
              language="javascript"
              height="600px"
              showLineNumbers
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolEditor;
