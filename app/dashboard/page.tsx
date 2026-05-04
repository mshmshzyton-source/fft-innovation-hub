"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, LogOut, Loader2 } from 'lucide-react';

type Message = { role: 'user' | 'ai'; content: string };

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am your AI assistant powered by Google Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check local auth state
    const auth = localStorage.getItem('isAuthenticated');
    if (!auth) {
      router.push('/login');
    } else {
      setEmail(localStorage.getItem('userEmail'));
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-surface flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <h1 className="font-semibold text-lg text-white">AI Workspace</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{email}</span>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface border border-gray-800 text-gray-200'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-surface border border-gray-800 rounded-2xl px-5 py-3 text-gray-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI anything..."
              className="w-full bg-surface border border-gray-700 focus:border-primary rounded-xl py-4 pl-6 pr-16 text-white shadow-lg focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 bg-primary hover:bg-primaryHover disabled:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-gray-500">
            Powered by Google Gemini API
          </div>
        </div>
      </div>
    </div>
  );
}
