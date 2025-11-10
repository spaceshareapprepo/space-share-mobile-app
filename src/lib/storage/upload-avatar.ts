import { supabase } from '@/src/lib/supabase';

export async function uploadAvatar(googleUrl: string, userId: string) {
  const fileName = `${userId}.jpg`;

  // 1. Download the remote image
  const response = await fetch(googleUrl);
  if (!response.ok) throw new Error('Failed to download avatar');
  const blob = await response.blob();

  // 2. Push it into the `avatars` bucket (upsert keeps it idempotent)
  const { error } = await supabase.storage
    .from('avatars')
    .upload(`public/${fileName}`, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: blob.type || 'image/jpeg',
    });

  if (error) throw error;

  // 3. Get the public URL and persist it on the profile
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(`public/${fileName}`);

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ public_avatar_url: publicUrl })
    .eq('id', userId);

  if (profileError) throw profileError;

  return publicUrl;
}
