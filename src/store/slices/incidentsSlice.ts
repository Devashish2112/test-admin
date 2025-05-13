import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getIncidents, updateIncident, verifyIncident as apiVerifyIncident, resolveIncident as apiResolveIncident } from '../../services/api';
import { RootState } from '../index';

interface Incident {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  location: string | { latitude: number; longitude: number };
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

// Helper to normalize incident data from the API
const normalizeIncident = (incident: any): Incident => {
  if (!incident) return incident;
  
  // Make sure the incident always has an id property
  return {
    ...incident,
    id: incident.id || incident._id
  };
};

// Helper to normalize incident array data from the API
const normalizeIncidents = (incidents: any[]): Incident[] => {
  if (!Array.isArray(incidents)) return [];
  return incidents.map(normalizeIncident);
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
    try {
      console.log('Fetching incidents with params:', params);
      const response = await getIncidents(params);
      console.log('Fetched incidents response:', response.data);
      
      // Ensure consistent ID handling
      const normalizedIncidents = normalizeIncidents(response.data);
      console.log('Normalized incidents:', normalizedIncidents);
      
      return normalizedIncidents;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    }
  }
);

export const updateIncidentStatus = createAsyncThunk(
  'incidents/updateStatus',
  async ({ incidentId, data }: { incidentId: string; data: Partial<Incident> }) => {
    try {
      console.log('Updating incident status:', incidentId, data);
      const response = await updateIncident(incidentId, data);
      console.log('Update incident response:', response.data);
      return normalizeIncident(response.data);
    } catch (error) {
      console.error('Error updating incident status:', error);
      throw error;
    }
  }
);

export const verifyIncident = createAsyncThunk(
  'incidents/verifyIncident',
  async (incidentId: string) => {
    try {
      console.log('Verifying incident:', incidentId);
      const response = await apiVerifyIncident(incidentId);
      console.log('Verify incident response:', response.data);
      return normalizeIncident(response.data);
    } catch (error) {
      console.error('Error verifying incident:', error);
      throw error;
    }
  }
);

export const resolveIncident = createAsyncThunk(
  'incidents/resolveIncident',
  async (incidentId: string) => {
    try {
      console.log('Resolving incident:', incidentId);
      const response = await apiResolveIncident(incidentId);
      console.log('Resolve incident response:', response.data);
      return normalizeIncident(response.data);
    } catch (error) {
      console.error('Error resolving incident:', error);
      throw error;
    }
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
        
        // Make sure we can find the incident by either id or _id
        const incidentId = action.payload.id || action.payload._id;
        if (!incidentId) return;
        
        const index = state.incidents.findIndex(incident => 
          (incident.id === incidentId || incident._id === incidentId)
        );
        
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      })
      .addCase(verifyIncident.fulfilled, (state, action) => {
        if (!Array.isArray(state.incidents)) {
          state.incidents = [];
          return;
        }
        
        // Make sure we can find the incident by either id or _id
        const incidentId = action.payload.id || action.payload._id;
        if (!incidentId) return;
        
        const index = state.incidents.findIndex(incident => 
          (incident.id === incidentId || incident._id === incidentId)
        );
        
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      })
      .addCase(resolveIncident.fulfilled, (state, action) => {
        if (!Array.isArray(state.incidents)) {
          state.incidents = [];
          return;
        }
        
        // Make sure we can find the incident by either id or _id
        const incidentId = action.payload.id || action.payload._id;
        if (!incidentId) return;
        
        const index = state.incidents.findIndex(incident => 
          (incident.id === incidentId || incident._id === incidentId)
        );
        
        if (index !== -1) {
          state.incidents[index] = action.payload;
        }
      });
  },
});

export const { setPage, setSearchQuery, setStatusFilter, setCategoryFilter } = incidentsSlice.actions;
export default incidentsSlice.reducer;
