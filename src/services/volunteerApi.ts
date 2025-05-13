import api from './api';

// New API calls for approve and reject volunteer
export const approveVolunteer = (volunteerId: string) =>
  api.put(`/admin/volunteers/${volunteerId}/status?status=approved`);

export const rejectVolunteer = (volunteerId: string) =>
  api.put(`/admin/volunteers/${volunteerId}/status?status=rejected`);

