import React, { useState } from 'react';
import { Button } from './ui/Button';
import { LinkItem, Category } from '../types';

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (links: Omit<LinkItem, 'id' | 'visits'>[]) => void;
  categories: Category[];
}

export const AddLinkDialog: React.FC<AddLinkDialogProps> = ({ isOpen, onClose, onAdd, categories }) => {
  // Manual Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'other');
  const [autoHttps, setAutoHttps] = useState(false);
  
  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalUrl = url.trim();
    
    // Auto-complete HTTPS logic
    if (autoHttps) {
      // Check if it already starts with http:// or https://
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
    }

    onAdd([{
      title,
      url: finalUrl,
      description: '用户添加的链接',
      category,
      icon: '🔗'
    }]);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    // Note: We keep autoHttps setting as user preference might persist during session.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg glass-panel bg-gray-900/90 rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">添加新链接</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-gray-400 mb-1">标题</label>
                <input 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="我的网站"
                />
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm text-gray-400">链接地址 (URL)</label>
                    {/* Auto HTTPS Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${autoHttps ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${autoHttps ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={autoHttps} 
                            onChange={(e) => setAutoHttps(e.target.checked)}
                        />
                        <span className={`text-xs transition-colors ${autoHttps ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                            自动补全 HTTPS
                        </span>
                    </label>
                </div>
                <input 
                    required
                    // If autoHttps is on, use 'text' type to allow domain without protocol. 
                    // If off, use 'url' to enforce browser validation.
                    type={autoHttps ? "text" : "url"}
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder={autoHttps ? "google.com" : "https://google.com"}
                />
                {autoHttps && (
                    <p className="text-xs text-gray-500 mt-1">
                        系统将自动添加 <span className="font-mono text-gray-400">https://</span> 前缀（如果未填写）。
                    </p>
                )}
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-1">分类</label>
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    <option value="other">其他</option>
                </select>
            </div>
            <div className="pt-4">
                <Button type="submit" className="w-full">添加到看板</Button>
            </div>
        </form>
      </div>
    </div>
  );
};