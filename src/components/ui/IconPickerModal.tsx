import { useAccessibleModal } from '../../hooks/useAccessibleModal';
import { useId } from 'react';
import React, { useState, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ICON_CATALOG, ICON_CATEGORIES } from './IconCatalog';
import { Search, X, Check, Sparkles } from 'lucide-react';

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconId: string, iconName?: string) => void;
  currentIcon?: string;
  title?: string;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentIcon = '',
  title = 'Select Technology / IoT / Certificate Icon'
}) => {
  const titleId = useId();
  const dialogRef = useAccessibleModal(isOpen, onClose);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customInput, setCustomInput] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(48);

  // Reset pagination limit when search or category filter updates (PERF-ADM-02)
  const [prevFilter, setPrevFilter] = useState({ query: deferredSearchQuery, cat: selectedCategory });
  if (prevFilter.query !== deferredSearchQuery || prevFilter.cat !== selectedCategory) {
    setPrevFilter({ query: deferredSearchQuery, cat: selectedCategory });
    setVisibleLimit(48);
  }

  // Filter icons based on category and deferred search query
  const filteredIcons = useMemo(() => {
    return ICON_CATALOG.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const q = deferredSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [deferredSearchQuery, selectedCategory]);

  const visibleIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleLimit);
  }, [filteredIcons, visibleLimit]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#090d16]/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center border border-brand-500/20 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 id={titleId} className="text-base font-extrabold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Choose from {ICON_CATALOG.length}+ official developer & IoT icons
                </p>
              </div>
            </div>

            <button
              onClick={onClose} aria-label="Close icon picker"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Custom Emoji/URL Input */}
          <div className="p-4 sm:p-6 pb-3 space-y-3 border-b border-gray-100 dark:border-gray-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search icons" placeholder="Search languages, frameworks, IoT, databases, cloud, protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-[var(--color-primary)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {ICON_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white shadow-xs shadow-brand-600/30'
                        : 'bg-gray-100 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icons Grid Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[460px]">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  No preset icons found matching "{searchQuery}"
                </p>
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 space-y-2">
                  <span className="text-xs text-brand-700 dark:text-brand-300 font-medium">
                    Or enter any custom Emoji / Icon identifier below:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ⚡ or https://example.com/icon.svg"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-brand-300 dark:border-brand-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        if (customInput.trim()) {
                          onSelect(customInput.trim());
                          onClose();
                        }
                      }}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold"
                    >
                      Use Custom
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {visibleIcons.map((item) => {
                    const Icon = item.Icon;
                    const isSelected = currentIcon === item.id || currentIcon === item.name;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelect(item.id, item.name);
                          onClose();
                        }}
                        className={`relative p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 group transition-all text-center ${
                          isSelected
                            ? 'bg-brand-50 dark:bg-brand-950/60 border-[var(--color-primary)] shadow-md shadow-brand-600/20 ring-2 ring-brand-500/20'
                            : 'bg-gray-50/70 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-800 hover:border-brand-500/50 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}

                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-115"
                          style={{ color: item.color }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate w-full line-clamp-1 leading-tight">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {visibleLimit < filteredIcons.length && (
                  <div className="pt-2 pb-1 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleLimit((prev) => prev + 48)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Load More Icons ({filteredIcons.length - visibleLimit} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Manual Input Option */}
          <div className="p-4 bg-gray-50 dark:bg-[#090d16] border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-gray-500 font-mono text-[11px]">
              <span>Selected:</span>
              <span className="font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                {currentIcon || 'None'}
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                aria-label="Custom icon" placeholder="Or custom emoji (e.g. 🤖)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (customInput.trim()) {
                    onSelect(customInput.trim());
                    onClose();
                  }
                }}
                disabled={!customInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-gray-800 dark:text-gray-200 font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
