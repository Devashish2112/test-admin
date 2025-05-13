// Removed duplicate declaration of updateAlertStatus thunk to fix TS errors

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAlerts, createAlert, updateAlertStatus as apiUpdateAlertStatus } from '../../services/api';
import { RootState } from '../index';

interface Alert {
  _id: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
  created_at: string;
  updated_at?: string;
  created_by_name?: string;
}

export interface AlertCreate {
  title: string;
  description: string;
  severity: string;
  category: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  source?: string;
}

interface AlertsState {
  alerts: Alert[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  severityFilter: string;
}

const initialState: AlertsState = {
  alerts: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  severityFilter: 'all',
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async ({ page, search, severity }: { page: number; search?: string; severity?: string }) => {
    const response = await getAlerts({ skip: (page - 1) * 10, limit: 10, search, severity });
    return response.data;
  }
);

export const createNewAlert = createAsyncThunk(
  'alerts/createAlert',
  async (data: AlertCreate) => {
    try {
      const response = await createAlert(data);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
);

export const updateAlertStatus = createAsyncThunk(
  'alerts/updateStatus',
  async ({ alertId, status }: { alertId: number; status: string }) => {
    const response = await apiUpdateAlertStatus(alertId, { status });
    return response.data;
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSeverityFilter: (state, action) => {
      state.severityFilter = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = Array.isArray(action.payload) ? action.payload : [];
        state.total = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
      })
      // Create Alert
      .addCase(createNewAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAlert.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.alerts)) {
          state.alerts = [];
        }
        state.alerts.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createNewAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create alert';
      })
      // Update Alert Status
      .addCase(updateAlertStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlertStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.alerts)) {
          state.alerts = [];
          return;
        }
        const alertIndex = state.alerts.findIndex(alert => alert._id === action.payload._id);
        if (alertIndex !== -1) {
          state.alerts[alertIndex] = action.payload;
        }
      })
      .addCase(updateAlertStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update alert status';
      });
  },
});

export const { setPage, setSearchQuery, setSeverityFilter } = alertsSlice.actions;
export default alertsSlice.reducer;
