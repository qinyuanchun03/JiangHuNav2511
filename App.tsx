import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_LINKS, INITIAL_CATEGORIES, WALLPAPERS } from './constants';
import { LinkItem, Category } from './types';
import { LinkCard } from './components/LinkCard';
import { OutboundDialog } from './components/OutboundDialog';
import { AddLinkDialog } from './components/AddLinkDialog';
import { Button } from './components/ui/Button';
import { fetchRemoteLinks } from './services/geminiService'; // Reusing service file for API

// Utility for simple unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  // --- State with LocalStorage Persistence ---
  
  // Load Links
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('nebula_links');
      return saved ? JSON.parse(saved) : INITIAL_LINKS;
    } catch (e) {
      console.error("Failed to load links from local storage", e);
      return INITIAL_LINKS;
    }
  });

  // Load Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('nebula_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch (e) {
      console.error("Failed to load categories from local storage", e);
      return INITIAL_CATEGORIES;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  
  // Dialog States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [outboundLink, setOutboundLink] = useState<LinkItem | null>(null);

  // Time State
  const [time, setTime] = useState(new Date());

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Remote Links on Mount
  useEffect(() => {
    const loadRemoteData = async () => {
      try {
        const remoteLinks = await fetchRemoteLinks();
        if (remoteLinks.length > 0) {
          setLinks(currentLinks => {
            // Avoid duplicates based on URL
            const existingUrls = new Set(currentLinks.map(l => l.url.toLowerCase()));
            const newLinks = remoteLinks
              .filter(l => !existingUrls.has(l.url.toLowerCase()))
              .map(l => ({
                ...l,
                id: generateId(),
                visits: 0
              }));
            
            if (newLinks.length === 0) return currentLinks;
            return [...currentLinks, ...newLinks];
          });

          // Update Categories if needed (simple check)
          setCategories(currentCats => {
             const existingCatIds = new Set(currentCats.map(c => c.id));
             const newCatIds = new Set<string>();
             
             remoteLinks.forEach(l => {
                 if (l.category && !existingCatIds.has(l.category) && l.category !== 'other') {
                     newCatIds.add(l.category);
                 }
             });

             if (newCatIds.size === 0) return currentCats;

             const newCategories = Array.from(newCatIds).map(id => ({
                 id,
                 name: id.charAt(0).toUpperCase() + id.slice(1) // Simple capitalization
             }));
             
             return [...currentCats, ...newCategories];
          });
        }
      } catch (err) {
        console.error("Error loading remote links:", err);
      }
    };

    loadRemoteData();
  }, []);

  // Persist Links
  useEffect(() => {
    localStorage.setItem('nebula_links', JSON.stringify(links));
  }, [links]);

  // Persist Categories
  useEffect(() => {
    localStorage.setItem('nebula_categories', JSON.stringify(categories));
  }, [categories]);

  // --- Handlers ---
  const handleLinkClick = (link: LinkItem) => {
    setOutboundLink(link);
  };

  const handleOutboundConfirm = () => {
    if (outboundLink) {
      window.open(outboundLink.url, '_blank', 'noopener,noreferrer');
      
      // Update visits
      setLinks(prev => prev.map(l => 
        l.id === outboundLink.id ? { ...l, visits: l.visits + 1 } : l
      ));
      
      setOutboundLink(null);
    }
  };

  const handleAddLinks = (newLinks: Omit<LinkItem, 'id' | 'visits'>[]) => {
    const linksToAdd: LinkItem[] = newLinks.map(l => ({
      ...l,
      id: generateId(),
      visits: 0
    }));
    setLinks(prev => [...prev, ...linksToAdd]);

    // Add any new categories if they don't exist
    const existingCats = new Set(categories.map(c => c.id));
    const newCategories: Category[] = [];
    linksToAdd.forEach(l => {
      if (!existingCats.has(l.category) && l.category !== 'other') {
        existingCats.add(l.category);
        newCategories.push({ id: l.category, name: l.category.charAt(0).toUpperCase() + l.category.slice(1) });
      }
    });

    if (newCategories.length > 0) {
      setCategories(prev => [...prev, ...newCategories]);
    }
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('确定要移除此链接吗？')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  const cycleWallpaper = () => {
    setCurrentWallpaperIndex(prev => (prev + 1) % WALLPAPERS.length);
  };

  // --- Derived State ---
  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
      const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            link.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [links, selectedCategory, searchQuery]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 -z-20"
        style={{ backgroundImage: `url(${WALLPAPERS[currentWallpaperIndex]})` }}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between glass-panel rounded-none border-x-0 border-t-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-xl">🌌</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white hidden md:block">NebulaNav</h1>
        </div>

        {/* Clock */}
        <div className="hidden md:flex flex-col items-center">
            <span className="text-3xl font-light text-white font-mono">
                {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <span className="text-xs text-gray-300 uppercase tracking-widest">
                {time.toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
        </div>

        <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={cycleWallpaper} title="更换壁纸" className="px-3">
                 🖼️
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
                + 添加链接
            </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        
        {/* Search & Filter Bar */}
        <div className="max-w-7xl mx-auto mb-8 space-y-4 md:space-y-0 md:flex items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    全部
                </button>
                {categories.map(cat => (
                     <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
                <input 
                    type="text"
                    placeholder="搜索链接..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLinks.map(link => (
                <LinkCard 
                    key={link.id} 
                    link={link} 
                    onClick={handleLinkClick} 
                    onDelete={handleDeleteLink}
                />
            ))}
            
            {filteredLinks.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-400">
                    <div className="text-6xl mb-4 opacity-50">🔭</div>
                    <h3 className="text-xl font-medium text-white mb-2">未找到链接</h3>
                    <p>尝试调整搜索或添加新链接。</p>
                    <Button variant="secondary" className="mt-6" onClick={() => setIsAddModalOpen(true)}>
                        添加新链接
                    </Button>
                </div>
            )}
        </div>
      </main>

      {/* Modals */}
      <OutboundDialog 
        link={outboundLink} 
        onClose={() => setOutboundLink(null)}
        onConfirm={handleOutboundConfirm}
      />
      
      <AddLinkDialog 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLinks}
        categories={categories}
      />

    </div>
  );
}