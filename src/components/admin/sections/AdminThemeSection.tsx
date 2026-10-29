import {
Laptop,
Moon,
Sun
} from 'lucide-react';
import type { AdminEditor } from '../useAdminEditor';

export function AdminThemeSection({ editor }: { editor: Pick<AdminEditor, 'colorPresets' | 'customHex' | 'handleColorChange' | 'setTheme' | 'theme'> }) {
  const { colorPresets, customHex, handleColorChange, setTheme, theme } = editor;
  return (
          <div className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-8 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme & Visual Styling Studio</h2>
              <p className="text-xs text-gray-500">
                Customize accent colors and the default theme. Applied edits enter the shared publication queue in hosted mode; local changes stay in this browser. Check publication status before viewing the portfolio.
              </p>
            </div>

            {/* Theme Mode Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Theme Mode:</span>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[
                  { mode: 'dark' as const, label: 'Dark Mode', icon: Moon },
                  { mode: 'light' as const, label: 'Light Mode', icon: Sun },
                  { mode: 'system' as const, label: 'System Default', icon: Laptop }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.mode;
                  return (
                    <button
                      key={item.mode}
                      onClick={() => setTheme(item.mode)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-brand-600/30'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-500/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Curated Accent Palettes:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => handleColorChange(preset.hex)}
                    className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all text-left ${
                      customHex.toLowerCase() === preset.hex.toLowerCase()
                        ? 'border-[var(--color-primary)] ring-2 ring-brand-500/30 bg-brand-50 dark:bg-brand-950/40'
                        : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full shrink-0 shadow-md" style={{ backgroundColor: preset.hex }} />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Hex */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 max-w-md">
              <label htmlFor="admin-primary-color" className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Custom HEX Color Code:
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="admin-primary-color"
                  type="color"
                  value={customHex}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-12 rounded-2xl cursor-pointer bg-transparent border-0"
                />
                <input
                  aria-label="Primary color hexadecimal value"
                  type="text"
                  value={customHex}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#5B3FE8"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        );
}
