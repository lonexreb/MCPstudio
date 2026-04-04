import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ToolFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  serverFilter: string;
  onServerFilterChange: (value: string) => void;
  serverNames: string[];
}

const ToolFilters = ({
  search,
  onSearchChange,
  serverFilter,
  onServerFilterChange,
  serverNames,
}: ToolFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={serverFilter} onValueChange={onServerFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Servers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Servers</SelectItem>
          {serverNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToolFilters;
