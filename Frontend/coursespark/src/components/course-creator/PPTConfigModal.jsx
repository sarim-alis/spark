// Imports.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileDown, Sparkles, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Frontend.
export default function PPTConfigModal({ isOpen, onClose, onGenerate, totalLessons }) {
  const [pageCount, setPageCount] = useState(10);

  const handleGenerate = () => {
    onGenerate(pageCount);
    onClose();
  };

  const maxPages = 10; // Max 10 pages

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Presentation className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Generate PowerPoint</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm">
                  Customize your presentation before generating
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Page Count Input */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 mb-2 block">
                      Number of Slides
                    </span>
                    <div className="relative">
                      <Input
                        type="number"
                        min="1"
                        max={maxPages}
                        value={pageCount}
                        onChange={(e) => setPageCount(Math.max(1, Math.min(maxPages, parseInt(e.target.value) || 10)))}
                        className="text-lg font-semibold pr-20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        slides
                      </span>
                    </div>
                  </label>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="1"
                    max={maxPages}
                    value={pageCount}
                    onChange={(e) => setPageCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Min: 1</span>
                    <span>Max: {maxPages}</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-1">
                        AI-Powered Design
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Your presentation will include:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          Title slide with course overview
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          Course outline with all lessons
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          Detailed slides for each topic
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          Professional design & formatting
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Estimated Info */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Estimated generation time:</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {Math.ceil(pageCount / 5)} - {Math.ceil(pageCount / 3)} seconds
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Generate PPT
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
