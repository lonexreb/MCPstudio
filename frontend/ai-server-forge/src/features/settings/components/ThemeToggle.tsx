import { Sun, Moon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore } from '../stores/settings-store';

const ThemeToggle = () => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
      <div className="flex items-center gap-3">
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-mcp-purple-400" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-400" />
        )}
        <div>
          <Label className="text-sm font-medium">Dark Mode</Label>
          <p className="text-xs text-muted-foreground">Toggle between dark and light themes</p>
        </div>
      </div>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  );
};

export default ThemeToggle;
