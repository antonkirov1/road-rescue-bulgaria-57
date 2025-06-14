
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="relative">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="pr-12 bg-white dark:bg-gray-900"
          autoComplete="off"
        />
        <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send Message</span>
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
