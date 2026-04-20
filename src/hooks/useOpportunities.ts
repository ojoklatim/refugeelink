import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Opportunity, OpportunityFormData, OpportunityFilters } from '../types';

export function useOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async (): Promise<Opportunity[]> => {
      let query = supabase
        .from('opportunities')
        .select('*, organisation:organisations(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('opp_type', filters.type);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.skills && filters.skills.length > 0) {
        query = query.overlaps('required_skills', filters.skills);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
}

export function useOpportunityById(id: string) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: async (): Promise<Opportunity | null> => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, organisation:organisations(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useOrgOpportunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['org-opportunities', user?.id],
    queryFn: async (): Promise<Opportunity[]> => {
      if (!user) return [];
      // First get the org id
      const { data: org } = await supabase
        .from('organisations')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!org) return [];

      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateOpportunity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: OpportunityFormData) => {
      if (!user) throw new Error('Not authenticated');
      // Get org id
      const { data: org } = await supabase
        .from('organisations')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!org) throw new Error('Organisation not found');

      const { data, error } = await supabase
        .from('opportunities')
        .insert({
          ...formData,
          org_id: org.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...formData }: Partial<OpportunityFormData> & { id: string }) => {
      const { data, error } = await supabase
        .from('opportunities')
        .update(formData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useAllOpportunities() {
  return useQuery({
    queryKey: ['all-opportunities'],
    queryFn: async (): Promise<Opportunity[]> => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, organisation:organisations(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}
