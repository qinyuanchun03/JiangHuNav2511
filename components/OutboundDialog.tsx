import React, { useEffect, useState } from 'react';
import { LinkItem } from '../types';
import { Button } from './ui/Button';

interface OutboundDialogProps {
  link: LinkItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const OutboundDialog: React.FC<OutboundDialogProps> = ({ link, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(3);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (link) {
      setCountdown(3);
      setCanProceed(false);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanProceed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [link]);

  if (!link) return null;

  const getHostname = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname;
    } catch (e) {
      return urlStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        {/* Header Graphic */}
        <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="text-6xl animate-bounce">
                {link.icon || '🚀'}
            </div>
        </div>

        <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">即将离开 NebulaNav</h3>
            <p className="text-gray-300 mb-6">
                您即将访问 <span className="text-blue-400 font-mono">{getHostname(link.url)}</span>。 
                <br/>
                请注意，外部网站内容不由我们负责。
            </p>

            <div className="flex flex-col gap-3">
                <Button 
                    variant="primary" 
                    onClick={onConfirm}
                    disabled={!canProceed}
                    className="w-full py-3 text-lg relative overflow-hidden"
                >
                    {canProceed ? (
                        <span>继续前往 &rarr;</span>
                    ) : (
                        <span>请等待 {countdown}s...</span>
                    )}
                     {/* Progress bar background */}
                     {!canProceed && (
                         <div 
                            className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-1000 ease-linear"
                            style={{ width: `${(countdown / 3) * 100}%` }}
                         />
                     )}
                </Button>
                <Button variant="ghost" onClick={onClose} className="w-full">
                    取消
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};