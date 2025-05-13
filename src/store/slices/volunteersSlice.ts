import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVolunteers, updateVolunteer } from '../../services/api';
import { approveVolunteer, rejectVolunteer } from '../../services/volunteerApi';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  skills: string[];
  availability: string;
  created_at: string;
  updated_at: string;
}

interface VolunteersState {
  volunteers: Volunteer[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  statusFilter: string;
}

const initialState: VolunteersState = {
  volunteers: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  statusFilter: 'all',
};

export const fetchVolunteers = createAsyncThunk(
  'volunteers/fetchVolunteers',
  async ({ page, search, status }: { page: number; search?: string; status?: string }) => {
    const response = await getVolunteers({ skip: (page - 1) * 10, limit: 10, search, status });
    console.log('fetchVolunteers response:', response);
    return response.data;
  }
);

export const updateVolunteerStatus = createAsyncThunk(
  'volunteers/updateStatus',
  async ({ volunteerId, status }: { volunteerId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await updateVolunteer(volunteerId, { status });
      return response.data;
    } catch (error: any) {
      console.error('updateVolunteerStatus error:', error);
      return rejectWithValue(error.response?.data || 'Failed to update volunteer status');
    }
  }
);

export const approveVolunteerStatus = createAsyncThunk(
  'volunteers/approveStatus',
  async (volunteerId: string, { rejectWithValue }) => {
    try {
      const response = await approveVolunteer(volunteerId);
      return response.data;
    } catch (error: any) {
      console.error('approveVolunteerStatus error:', error);
      return rejectWithValue(error.response?.data || 'Failed to approve volunteer');
    }
  }
);

export const rejectVolunteerStatus = createAsyncThunk(
  'volunteers/rejectStatus',
  async (volunteerId: string, { rejectWithValue }) => {
    try {
      const response = await rejectVolunteer(volunteerId);
      return response.data;
    } catch (error: any) {
      console.error('rejectVolunteerStatus error:', error);
      return rejectWithValue(error.response?.data || 'Failed to reject volunteer');
    }
  }
);

const volunteersSlice = createSlice({
  name: 'volunteers',
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch Volunteers
      .addCase(fetchVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteers.fulfilled, (state, action) => {
        console.log('fetchVolunteers.fulfilled payload:', action.payload);
        state.loading = false;
        if (Array.isArray(action.payload)) {
          // Map _id to id for each volunteer
          state.volunteers = action.payload.map((volunteer: any) => ({
            ...volunteer,
            id: volunteer._id,
          }));
          // Fix: total should not be length of array if backend returns total separately
          state.total = action.payload.length;
        } else if (action.payload && action.payload.volunteers) {
          // Map _id to id for each volunteer
          state.volunteers = action.payload.volunteers.map((volunteer: any) => ({
            ...volunteer,
            id: volunteer._id,
          }));
          state.total = action.payload.total;
        } else {
          state.volunteers = [];
          state.total = 0;
        }
      })
      .addCase(fetchVolunteers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch volunteers';
      })
      // Update Volunteer
      .addCase(updateVolunteerStatus.fulfilled, (state, action) => {
        const index = state.volunteers.findIndex(volunteer => volunteer.id === action.payload.id);
        if (index !== -1) {
          state.volunteers[index] = action.payload;
        }
      })
      // Approve Volunteer
      .addCase(approveVolunteerStatus.fulfilled, (state, action) => {
        const index = state.volunteers.findIndex(volunteer => volunteer.id === String(action.meta.arg));
        if (index !== -1) {
          state.volunteers[index].status = 'approved';
        }
      })
      // Reject Volunteer
      .addCase(rejectVolunteerStatus.fulfilled, (state, action) => {
        const index = state.volunteers.findIndex(volunteer => volunteer.id === String(action.meta.arg));
        if (index !== -1) {
          state.volunteers[index].status = 'rejected';
        }
      });
  },
});

export const { setPage, setSearchQuery, setStatusFilter } = volunteersSlice.actions;
export default volunteersSlice.reducer;
