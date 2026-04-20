import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Organisation, OrgFormData } from '../types';

export function useOrgProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['org-profile', user?.id],
    queryFn: async (): Promise<Organisation | null> => {
      if (!user) return null;
      
      // Return mock data for demo users
      if (user.id === 'mock-user-id') {
        return {
          id: 'mock-org-id',
          user_id: user.id,
          name: 'Global Refugee Initiative',
          description: 'A leading organisation supporting refugee settlements with sustainable solutions.',
          sector: 'Non-Profit',
          location: 'Kampala, Uganda',
          website: 'https://gri.org',
          contact_email: 'contact@gri.org',
          contact_phone: '+256 750 111 222',
          approved: true,
          created_at: new Date().toISOString(),
        } as Organisation;
      }

      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateOrg() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: OrgFormData) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('organisations')
        .insert({
          ...formData,
          user_id: user.id,
          approved: false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-profile'] });
    },
  });
}

export function useUpdateOrg() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<OrgFormData>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('organisations')
        .update(formData)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-profile'] });
    },
  });
}

export function useAllOrgs() {
  return useQuery({
    queryKey: ['all-organisations'],
    queryFn: async (): Promise<Organisation[]> => {
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) {
        return [
          {
            id: 'o1',
            user_id: 'ou1',
            name: 'Global Refugee Initiative',
            description: 'Support for refugees.',
            sector: 'Non-Profit',
            org_type: 'NGO',
            location: 'Kampala',
            website: 'https://gri.org',
            contact_email: 'info@gri.org',
            contact_phone: '+256 750 000 000',
            approved: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'o2',
            user_id: 'ou2',
            name: 'Mercy Corps',
            description: 'Global humanitarian aid.',
            sector: 'International NGO',
            org_type: 'INGO',
            location: 'Nairobi',
            website: 'https://mercycorps.org',
            contact_email: 'contact@mercycorps.org',
            contact_phone: '+254 700 000 000',
            approved: true,
            created_at: new Date().toISOString(),
          },
        ] as Organisation[];
      }
      return data;
    },
  });
}

export function useApproveOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from('organisations')
        .update({ approved })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-organisations'] });
    },
  });
}
