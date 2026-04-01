import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose, title, content, link }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-2xl w-full p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold mb-6 text-gradient">{title}</h2>
              <div className="space-y-4 text-zinc-300 leading-relaxed text-sm lg:text-base">
                {content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {link && (
                <div className="mt-10 pt-6 border-t border-zinc-800">
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition-colors"
                  >
                    Explore Research Paper <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
