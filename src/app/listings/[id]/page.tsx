import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Listing } from '@/types/database';

const conditionDescriptions: Record<string, string> = {
  mint: 'Like new, no visible wear',
  excellent: 'Minor signs of use, fully functional',
  good: 'Normal wear, fully functional',
  fair: 'Noticeable wear, works fine',
  poor: 'Heavy wear, may have issues',
};

export default async function ListingPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!listing) {
    notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', listing.user_id)
    .single();

  const createdAt = new Date(listing.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="text-rack-muted hover:text-rack-accent transition-colors text-sm mb-6 inline-block py-2 px-1">
        ← Back to listings
      </Link>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="aspect-square bg-rack-bg flex items-center justify-center">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-rack-muted">
                <p className="text-6xl mb-2">🎛️</p>
                <p className="text-sm">No image provided</p>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-rack-muted uppercase tracking-wider">{listing.manufacturer}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{listing.module_name}</h1>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className={`badge ${
                listing.status === 'active' ? 'badge-active' :
                listing.status === 'sold' ? 'badge-sold' : 'badge-reserved'
              }`}>
                {listing.status}
              </span>
              <span className="text-rack-muted text-sm">Listed {createdAt}</span>
            </div>
          </div>

          <div className="text-3xl md:text-4xl font-bold text-rack-accent">
            €{listing.price.toLocaleString()}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-xs text-rack-muted">Type</p>
              <p className="font-semibold text-sm capitalize">{listing.module_type}</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-rack-muted">Width</p>
              <p className="font-semibold text-sm">{listing.hp} HP</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-rack-muted">Condition</p>
              <p className="font-semibold text-sm capitalize">{listing.condition}</p>
              <p className="text-xs text-rack-muted hidden sm:block">{conditionDescriptions[listing.condition]}</p>
            </div>
            {listing.location && (
              <div className="card p-3">
                <p className="text-xs text-rack-muted">Location</p>
                <p className="font-semibold text-sm">📍 {listing.location}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold mb-2 text-sm md:text-base">Description</h2>
            <p className="text-rack-muted text-sm whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Seller */}
          <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-rack-muted">Seller</p>
              <p className="font-semibold">{profile?.username || 'Unknown'}</p>
            </div>
            <button className="btn-primary text-sm w-full sm:w-auto">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
