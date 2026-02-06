'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { ModuleType, ModuleCondition } from '@/types/database';

const MODULE_TYPES: ModuleType[] = ['oscillator', 'filter', 'envelope', 'lfo', 'vca', 'mixer', 'sequencer', 'effect', 'utility', 'other'];
const CONDITIONS: ModuleCondition[] = ['mint', 'excellent', 'good', 'fair', 'poor'];

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
      } else {
        setUserId(user.id);
      }
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('module-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('module-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from('listings').insert({
      user_id: userId,
      title: `${formData.get('manufacturer')} ${formData.get('module_name')}`,
      manufacturer: formData.get('manufacturer') as string,
      module_name: formData.get('module_name') as string,
      module_type: formData.get('module_type') as ModuleType,
      hp: parseInt(formData.get('hp') as string),
      price: parseFloat(formData.get('price') as string),
      currency: 'EUR',
      condition: formData.get('condition') as ModuleCondition,
      description: formData.get('description') as string,
      image_url: imageUrl,
      location: formData.get('location') as string || null,
      status: 'active',
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">List a Module for Sale</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm text-rack-muted mb-2">Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 bg-rack-bg border-2 border-dashed border-rack-border rounded-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-rack-muted text-3xl">📸</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-rack-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-rack-border file:bg-rack-surface file:text-rack-text file:text-sm hover:file:bg-rack-bg file:cursor-pointer file:transition-colors"
            />
          </div>
        </div>

        {/* Module Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-rack-muted mb-1">Manufacturer *</label>
            <input name="manufacturer" className="input-field" placeholder="Mutable Instruments" required />
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">Module Name *</label>
            <input name="module_name" className="input-field" placeholder="Clouds" required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-rack-muted mb-1">Type *</label>
            <select name="module_type" className="select-field" required>
              {MODULE_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">HP Size *</label>
            <input name="hp" type="number" min={1} max={84} className="input-field" placeholder="18" required />
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">Condition *</label>
            <select name="condition" className="select-field" required>
              {CONDITIONS.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-rack-muted mb-1">Price (EUR) *</label>
            <input name="price" type="number" min={0} step={0.01} className="input-field" placeholder="185.00" required />
          </div>
          <div>
            <label className="block text-sm text-rack-muted mb-1">Location</label>
            <input name="location" className="input-field" placeholder="Utrecht, NL" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-rack-muted mb-1">Description *</label>
          <textarea
            name="description"
            className="input-field min-h-[120px] resize-y"
            placeholder="Describe the module's condition, any modifications, included cables/accessories..."
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
