'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const MODULE_TYPES = ['all', 'oscillator', 'filter', 'envelope', 'lfo', 'vca', 'mixer', 'sequencer', 'effect', 'utility', 'other'] as const;
const CONDITIONS = ['all', 'mint', 'excellent', 'good', 'fair', 'poor'] as const;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'hp_asc', label: 'HP: Small → Large' },
] as const;

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="space-y-3">
      {/* Search - Full width on mobile */}
      <input
        type="text"
        placeholder="Search modules..."
        defaultValue={searchParams.get('q') || ''}
        onChange={(e) => updateFilter('q', e.target.value)}
        className="input-field w-full sm:max-w-xs text-sm"
      />

      {/* Filters - 2 column grid on mobile, flex on desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
        {/* Type Filter */}
        <select
          value={searchParams.get('type') || 'all'}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="select-field text-sm"
        >
          {MODULE_TYPES.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        {/* Condition Filter */}
        <select
          value={searchParams.get('condition') || 'all'}
          onChange={(e) => updateFilter('condition', e.target.value)}
          className="select-field text-sm"
        >
          {CONDITIONS.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'Any Condition' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort - spans 2 cols on mobile */}
        <select
          value={searchParams.get('sort') || 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="select-field text-sm col-span-2 sm:col-span-1"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
