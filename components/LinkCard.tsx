import React from 'react';
import { LinkItem } from '../types';

interface LinkCardProps {
  link: LinkItem;
  onClick: (link: LinkItem) => void;
  onDelete?: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onClick, onDelete }) => {
  // Helper to safely get hostname
  const getHostname = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname.replace('www.', '');
    } catch (e) {
      return urlStr;
    }
  };

  return (
    <div 
      className="group relative flex flex-col p-4 rounded-xl glass-panel hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 cursor-pointer overflow-hidden"
      onClick={() => onClick(link)}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-2xl shadow-inner">
            {link.icon || '🔗'}
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight group-hover:text-blue-300 transition-colors">
              {link.title}
            </h3>
            <p className="text-xs text-gray-300/80 mt-0.5 max-w-[150px] truncate">
              {getHostname(link.url)}
            </p>
          </div>
        </div>
        
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            className="text-gray-400 hover:text-red-400 p-1 rounded-md hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            title="移除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-300 mt-3 line-clamp-2 z-10">
        {link.description}
      </p>

      <div className="mt-auto pt-3 flex items-center gap-2 z-10">
        <span className="text-[10px] uppercase tracking-wider font-bold text-white/40 bg-white/5 px-2 py-1 rounded-full">
          {link.category}
        </span>
      </div>
    </div>
  );
};