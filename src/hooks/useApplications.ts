import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Application, ApplicationStatus } from '../types';

export function useMyApplications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: async (): Promise<Application[]> => {
      if (!user) return [];
      
      // Mock data for demo users
      if (user.id === 'mock-user-id') {
        return [
          {
            id: 'app1',
            refugee_id: 'mock-refugee-id',
            opportunity_id: 'opp1',
            status: 'shortlisted',
            applied_at: new Date().toISOString(),
            opportunity: {
              id: 'opp1',
              title: 'Senior Carpenter',
              organisation: { name: 'Global Refugee Initiative' }
            }
          },
          {
            id: 'app2',
            refugee_id: 'mock-refugee-id',
            opportunity_id: 'opp2',
            status: 'applied',
            applied_at: new Date().toISOString(),
            opportunity: {
              id: 'opp2',
              title: 'Agriculture Assistant',
              organisation: { name: 'Mercy Corps' }
            }
          }
        ] as any[];
      }

      // Get refugee id first
      const { data: refugee } = await supabase
        .from('refugees')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!refugee) return [];

      const { data, error } = await supabase
        .from('applications')
        .select('*, opportunity:opportunities(*, organisation:organisations(*))')
        .eq('refugee_id', refugee.id)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useApplyToOpportunity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opportunityId: string) => {
      if (!user) throw new Error('Not authenticated');
      // Get refugee id
      const { data: refugee } = await supabase
        .from('refugees')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!refugee) throw new Error('Refugee profile not found');

      const { data, error } = await supabase
        .from('applications')
        .insert({
          refugee_id: refugee.id,
          opportunity_id: opportunityId,
          status: 'applied',
        })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already applied to this opportunity');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity-applicants'] });
    },
  });
}

export function useOpportunityApplicants(opportunityId: string) {
  return useQuery({
    queryKey: ['opportunity-applicants', opportunityId],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, refugee:refugees(*)')
        .eq('opportunity_id', opportunityId)
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!opportunityId,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-applicants'] });
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
    },
  });
}

export function useAllApplications() {
  return useQuery({
    queryKey: ['all-applications'],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, refugee:refugees(*), opportunity:opportunities(*, organisation:organisations(*))')
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useHasApplied(opportunityId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-applied', opportunityId, user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;
      const { data: refugee } = await supabase
        .from('refugees')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!refugee) return false;

      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('refugee_id', refugee.id)
        .eq('opportunity_id', opportunityId)
        .single();
      return !!data;
    },
    enabled: !!user && !!opportunityId,
  });
}
