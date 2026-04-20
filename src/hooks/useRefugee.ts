import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Refugee, RefugeeFormData } from '../types';
import { generateRefugeeId } from '../lib/helpers';

export function useRefugeeProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['refugee-profile', user?.id],
    queryFn: async (): Promise<Refugee | null> => {
      if (!user) return null;
      
      // Return mock data for demo users
      if (user.id === 'mock-user-id') {
        return {
          id: 'mock-refugee-id',
          user_id: user.id,
          full_name: 'John Doe',
          ref_id: 'REF-2024-8892',
          country_of_origin: 'South Sudan',
          location: 'Bidi Bidi Refugee Settlement',
          phone: '+256 700 000 000',
          id_type: 'unhcr',
          education_level: 'Bachelors Degree',
          skills: ['Carpentry', 'Plumbing', 'Agriculture'],
          languages: ['English', 'Swahili', 'Arabic'],
          work_experience: [],
          verification_status: 'verified',
          created_at: new Date().toISOString(),
        } as Refugee;
      }

      const { data, error } = await supabase
        .from('refugees')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateRefugee() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: RefugeeFormData) => {
      if (!user) throw new Error('Not authenticated');
      const refId = generateRefugeeId();
      const { data, error } = await supabase
        .from('refugees')
        .insert({
          ...formData,
          user_id: user.id,
          ref_id: refId,
          verification_status: 'unverified',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refugee-profile'] });
    },
  });
}

export function useUpdateRefugee() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<RefugeeFormData>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('refugees')
        .update(formData)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refugee-profile'] });
    },
  });
}

export function useAllRefugees() {
  return useQuery({
    queryKey: ['all-refugees'],
    queryFn: async (): Promise<Refugee[]> => {
      const { data, error } = await supabase
        .from('refugees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) {
        return [
          {
            id: '1',
            user_id: 'u1',
            full_name: 'John Doe',
            ref_id: 'REF-2024-8892',
            country_of_origin: 'South Sudan',
            location: 'Bidi Bidi',
            phone: '+256 700 000 000',
            id_type: 'unhcr',
            education_level: 'Bachelors',
            skills: ['Carpentry'],
            languages: ['English'],
            work_experience: [],
            verification_status: 'pending',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            user_id: 'u2',
            full_name: 'Jane Smith',
            ref_id: 'REF-2024-1122',
            country_of_origin: 'Somalia',
            location: 'Kyaka II',
            phone: '+256 701 000 000',
            id_type: 'govt',
            education_level: 'Diploma',
            skills: ['Tailoring'],
            languages: ['English', 'Somali'],
            work_experience: [],
            verification_status: 'verified',
            created_at: new Date().toISOString(),
          },
        ] as Refugee[];
      }
      return data;
    },
  });
}

export function useRefugeeById(id: string) {
  return useQuery({
    queryKey: ['refugee', id],
    queryFn: async (): Promise<Refugee | null> => {
      const { data, error } = await supabase
        .from('refugees')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('refugees')
        .update({ verification_status: status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-refugees'] });
      queryClient.invalidateQueries({ queryKey: ['refugee-profile'] });
    },
  });
}
