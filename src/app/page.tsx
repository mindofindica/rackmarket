import { createServerSupabase } from '@/lib/supabase/server';
import { ListingCard } from '@/components/ListingCard';
import { FilterBar } from '@/components/FilterBar';
import type { Listing } from '@/types/database';
import Link from 'next/link';

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; condition?: string; sort?: string };
}) {
  const supabase = createServerSupabase();

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active');

  // Search
  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,manufacturer.ilike.%${searchParams.q}%,module_name.ilike.%${searchParams.q}%`
    );
  }

  // Type filter
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('module_type', searchParams.type);
  }

  // Condition filter
  if (searchParams.condition && searchParams.condition !== 'all') {
    query = query.eq('condition', searchParams.condition);
  }

  // Sort
  switch (searchParams.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'hp_asc':
      query = query.order('hp', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: listings } = await query;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Buy & Sell <span className="text-rack-accent">Eurorack</span> Modules
        </h1>
        <p className="text-rack-muted text-lg max-w-2xl mx-auto">
          The marketplace built for modular synth heads. Find your next module or pass one along.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Link href="/auth/signup" className="btn-primary">
            Start Selling
          </Link>
          <a href="#listings" className="btn-secondary">
            Browse Modules
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="text-center p-4 card">
          <p className="text-2xl font-bold text-rack-accent">{listings?.length || 0}</p>
          <p className="text-xs text-rack-muted">Active Listings</p>
        </div>
        <div className="text-center p-4 card">
          <p className="text-2xl font-bold text-rack-accent">€{
            listings?.reduce((sum, l) => sum + l.price, 0)?.toLocaleString() || 0
          }</p>
          <p className="text-xs text-rack-muted">Total Value</p>
        </div>
        <div className="text-center p-4 card">
          <p className="text-2xl font-bold text-rack-accent">
            {new Set(listings?.map(l => l.manufacturer)).size || 0}
          </p>
          <p className="text-xs text-rack-muted">Manufacturers</p>
        </div>
      </section>

      {/* Filters & Listings */}
      <section id="listings" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Available Modules</h2>
        </div>
        
        <FilterBar />

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <p className="text-4xl mb-4">🎛️</p>
            <p className="text-rack-muted text-lg">No modules listed yet</p>
            <p className="text-rack-muted text-sm mt-2">Be the first to list a module!</p>
            <Link href="/listings/new" className="btn-primary inline-block mt-6">
              List a Module
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
