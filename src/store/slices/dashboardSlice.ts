import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardStats, getIncidentAnalytics, getAlertAnalytics } from '../../services/api';
import axios from 'axios';

interface DashboardStats {
  total_users: number;
  total_incidents: number;
  total_alerts: number;
  total_volunteers: number;
  pending_incidents: number;
  pending_volunteers: number;
  recent_incidents: any[];
  recent_alerts: any[];
  recent_volunteers: any[];
}

interface AnalyticsData {
  date: string;
  count: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  incidentAnalytics: AnalyticsData[];
  alertAnalytics: AnalyticsData[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  incidentAnalytics: [],
  alertAnalytics: [],
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    try {
      const response = await getDashboardStats();
      return response.data || {};
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'dashboard/fetchAnalytics',
  async (period: '7d' | '30d' | '90d' | '1y') => {
    try {
      const [incidentResponse, alertResponse] = await Promise.all([
        getIncidentAnalytics(period),
        getAlertAnalytics(period),
      ]);
      return {
        incidents: incidentResponse.data || [],
        alerts: alertResponse.data || [],
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  'dashboard/updateVolunteerStatus',
  async ({ volunteerId, status }: { volunteerId: number; status: string }) => {
    const response = await axios.put(`/api/admin/volunteers/${volunteerId}/status`, { status });
    return response.data;
  }
);

export const updateIncidentStatus = createAsyncThunk(
  'dashboard/updateIncidentStatus',
  async ({ incidentId, status }: { incidentId: string; status: string }) => {
    const response = await axios.put(`/api/admin/incidents/${incidentId}/status`, { status });
    return { incidentId, status, message: response.data.message };
  }
);

export const updateAlertStatus = createAsyncThunk(
  'dashboard/updateAlertStatus',
  async ({ alertId, status }: { alertId: string; status: string }) => {
    const response = await axios.put(`/api/admin/alerts/${alertId}/status`, { status });
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure stats has all required properties
        state.stats = {
          total_users: action.payload.total_users || 0,
          total_incidents: action.payload.total_incidents || 0,
          total_alerts: action.payload.total_alerts || 0,
          total_volunteers: action.payload.total_volunteers || 0,
          pending_incidents: action.payload.pending_incidents || 0,
          pending_volunteers: action.payload.pending_volunteers || 0,
          recent_incidents: Array.isArray(action.payload.recent_incidents) ? action.payload.recent_incidents : [],
          recent_alerts: Array.isArray(action.payload.recent_alerts) ? action.payload.recent_alerts : [],
          recent_volunteers: Array.isArray(action.payload.recent_volunteers) ? action.payload.recent_volunteers : [],
        };
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard stats';
      })
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.incidentAnalytics = Array.isArray(action.payload.incidents) ? action.payload.incidents : [];
        state.alertAnalytics = Array.isArray(action.payload.alerts) ? action.payload.alerts : [];
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      })
      // Update Volunteer Status
      .addCase(updateVolunteerStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.stats && state.stats.recent_volunteers) {
          const volunteerIndex = state.stats.recent_volunteers.findIndex(
            (volunteer) => volunteer._id === action.payload._id
          );
          if (volunteerIndex !== -1) {
            state.stats.recent_volunteers[volunteerIndex] = action.payload;
          }
        }
      })
      .addCase(updateVolunteerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update volunteer status';
      })
      // Update Incident Status
      .addCase(updateIncidentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.stats && state.stats.recent_incidents) {
          const incidentIndex = state.stats.recent_incidents.findIndex(
            (incident) => incident._id === action.payload.incidentId
          );
          if (incidentIndex !== -1) {
            state.stats.recent_incidents[incidentIndex].status = action.payload.status;
          }
        }
      })
      .addCase(updateIncidentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update incident status';
      })
      // Update Alert Status
      .addCase(updateAlertStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlertStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAlertStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update alert status';
      });
  },
});

export default dashboardSlice.reducer; 