import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getIncidents, updateIncident } from '../../services/api';
import { RootState } from '../index';

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  severity: string;
  reported_by: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

interface IncidentsState {
  incidents: Incident[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
}

const initialState: IncidentsState = {
  incidents: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  statusFilter: 'all',
  categoryFilter: 'all',
};

export const fetchIncidents = createAsyncThunk(
  'incidents/fetchIncidents',
  async ({ page, search, status, category }: { page: number; search?: string; status?: string; category?: string }) => {
    const params: any = { search };
    if (status && status !== 'all') {
      params.status = status;
    }
    if (category && category !== 'all') {
      params.category = category;
    }
    const response = await getIncidents(params);
    return response.data;
  }
);

export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ incidentId, data }: { incidentId: string; data: Partial<Incident> }) => {
    const response = await updateIncident(incidentId, data);
    return response.data;
  }
);

export const verifyIncident = createAsyncThunk(
  'incidents/verifyIncident',
  async (incidentId: string) => {
    const response = await api.put(`/admin/incidents/${incidentId}/verify`);
    return response.data;
  }
);

export const resolveIncident = createAsyncThunk(
  'incidents/resolveIncident',
  async (incidentId: string) => {
    const response = await api.put(`/admin/incidents/${incidentId}/resolve`);
    return response.data;
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Incidents
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.loading = false;
        state.incidents = Array.isArray(action.payload) ? action.payload : [];
        state.total = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch incidents';
      })
      // Update Incident
      .addCase(updateIncidentStatus.fulfilled, (state, action) => {
        if (!Array.isArray(state.incidents)) {
          state.incidents = [];
          return;
        }
        const index = state.incidents.findIndex(incident => incident.id === action.payload.id);
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      })
      .addCase(verifyIncident.fulfilled, (state, action) => {
        if (!Array.isArray(state.incidents)) {
          state.incidents = [];
          return;
        }
        const index = state.incidents.findIndex(incident => incident.id === action.payload.id);
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      })
      .addCase(resolveIncident.fulfilled, (state, action) => {
        if (!Array.isArray(state.incidents)) {
          state.incidents = [];
          return;
        }
        const index = state.incidents.findIndex(incident => incident.id === action.payload.id);
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      });
  },
});

export const { setPage, setSearchQuery, setStatusFilter, setCategoryFilter } = incidentsSlice.actions;
export default incidentsSlice.reducer;
