import Link from 'next/link';
import type { Listing } from '@/types/database';

const conditionColors: Record<string, string> = {
  mint: 'text-green-400 bg-green-500/10',
  excellent: 'text-emerald-400 bg-emerald-500/10',
  good: 'text-blue-400 bg-blue-500/10',
  fair: 'text-yellow-400 bg-yellow-500/10',
  poor: 'text-red-400 bg-red-500/10',
};

const typeIcons: Record<string, string> = {
  oscillator: '◈',
  filter: '◇',
  envelope: '△',
  lfo: '○',
  vca: '▽',
  mixer: '◎',
  sequencer: '▦',
  effect: '✦',
  utility: '⬡',
  other: '◻',
};

export function ListingCard({ listing }: { listing: Listing }) {
  const statusBadge = listing.status === 'active' 
    ? 'badge-active' 
    : listing.status === 'sold' 
    ? 'badge-sold' 
    : 'badge-reserved';

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="card group cursor-pointer">
        {/* Image Area - Reduced aspect ratio on mobile */}
        <div className="aspect-[3/2] sm:aspect-[4/3] bg-rack-bg flex items-center justify-center relative overflow-hidden">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-3xl sm:text-4xl text-rack-muted/30 select-none">
              {typeIcons[listing.module_type] || '◻'}
            </div>
          )}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className={statusBadge}>{listing.status}</span>
          </div>
        </div>

        {/* Info - More compact on mobile */}
        <div className="p-3 sm:p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-rack-muted uppercase tracking-wider truncate">
                {listing.manufacturer}
              </p>
              <h3 className="font-semibold text-sm sm:text-base text-rack-text truncate group-hover:text-rack-accent transition-colors">
                {listing.module_name}
              </h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-rack-accent whitespace-nowrap">
              €{listing.price}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className={`badge ${conditionColors[listing.condition] || ''}`}>
              {listing.condition}
            </span>
            <span className="text-rack-muted">{listing.hp}HP</span>
            <span className="text-rack-muted capitalize truncate">{listing.module_type}</span>
          </div>

          {listing.location && (
            <p className="text-xs text-rack-muted truncate">📍 {listing.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
