import { useQuery } from '@tanstack/react-query';

import type { EntretienClient, JobA1Client } from './clients';
import { fakeEntretienClient, fakeJobA1Client } from './fake';

// Un seul endroit à changer pour brancher la vraie API.
export const api: EntretienClient = fakeEntretienClient;
export const jobA1: JobA1Client = fakeJobA1Client;

export const useParcours = () =>
  useQuery({ queryKey: ['parcours'], queryFn: () => api.getParcours() });
export const useOffres = () => useQuery({ queryKey: ['offres'], queryFn: () => api.getOffres() });
export const useLecon = (id: string) =>
  useQuery({ queryKey: ['lecon', id], queryFn: () => api.getLecon(id) });
export const useProgres = () =>
  useQuery({ queryKey: ['progres'], queryFn: () => api.getProgres() });
export const useClassement = (type: 'ligue' | 'amis') =>
  useQuery({ queryKey: ['classement', type], queryFn: () => api.getClassement(type) });
export const useBilan = (id: string) =>
  useQuery({ queryKey: ['bilan', id], queryFn: () => api.getBilan(id) });
export const useSuiviJobA1 = () =>
  useQuery({
    queryKey: ['jobA1', 'suivi'],
    queryFn: async () => {
      const [profil, orp, candidatures] = await Promise.all([
        jobA1.getProfile(),
        jobA1.getOrpProgress(),
        jobA1.getApplications(),
      ]);
      return { profil, orp, candidatures };
    },
  });
