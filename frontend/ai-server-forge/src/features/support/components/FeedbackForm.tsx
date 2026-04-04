import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/features/execution/lib/db';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.feedback.add({
      name: name.trim(),
      email: email.trim(),
      category: category || 'other',
      message: message.trim(),
      createdAt: new Date(),
    });
    toast({
      title: 'Feedback saved',
      description: 'Your feedback has been stored locally. Thank you!',
    });
    setName('');
    setEmail('');
    setCategory('');
    setMessage('');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Send Feedback</h3>
      <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-card border border-border/50 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fb-name">Name</Label>
            <Input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-email">Email</Label>
            <Input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fb-message">Message</Label>
          <Textarea
            id="fb-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your feedback..."
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" disabled={!message.trim()} className="gradient-brand">
          <Send className="h-4 w-4 mr-1.5" />
          Send Feedback
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
