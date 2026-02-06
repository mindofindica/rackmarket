export type ModuleCondition = 'mint' | 'excellent' | 'good' | 'fair' | 'poor';
export type ModuleType = 'oscillator' | 'filter' | 'envelope' | 'lfo' | 'vca' | 'mixer' | 'sequencer' | 'effect' | 'utility' | 'other';
export type ListingStatus = 'active' | 'sold' | 'reserved';

export interface Listing {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  manufacturer: string;
  module_name: string;
  module_type: ModuleType;
  hp: number;
  price: number;
  currency: string;
  condition: ModuleCondition;
  description: string;
  image_url: string | null;
  status: ListingStatus;
  location: string | null;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}
