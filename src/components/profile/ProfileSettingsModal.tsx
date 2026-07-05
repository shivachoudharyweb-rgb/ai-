'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabaseClient';
import { X, Camera, Loader2, Save } from 'lucide-react';

export function ProfileSettingsModal() {
  const { user, profile, profileModalOpen, setProfileModalOpen, refreshProfile } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile, profileModalOpen]);

  if (!profileModalOpen || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      
      // Auto-save the new avatar URL to profile
      await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      await refreshProfile();
      setMessage({ type: 'success', text: 'Avatar updated!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-0">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[rgb(var(--background-card))] shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[rgb(var(--border))]">
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-6 py-4">
          <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">Profile Settings</h2>
          <button
            onClick={() => setProfileModalOpen(false)}
            className="rounded-full p-2 text-[rgb(var(--foreground-muted))] hover:bg-[rgb(var(--background-secondary))] hover:text-[rgb(var(--foreground))] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {message.text && (
            <div
              className={`mb-6 rounded-xl p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="flex h-24 w-24 overflow-hidden rounded-full border-4 border-[rgb(var(--background))] bg-indigo-100 shadow-lg dark:bg-indigo-900/50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="m-auto text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                    {(firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[rgb(var(--background))] bg-indigo-600 text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
              />
            </div>
            <p className="text-sm font-medium text-[rgb(var(--foreground))]">{user.email}</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-[rgb(var(--foreground-muted))]">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-[rgb(var(--foreground-muted))]">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
