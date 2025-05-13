import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, updateUser } from '../../services/api';
import { RootState } from '../index';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  is_admin: boolean;
  is_volunteer: boolean;
}

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
}

const initialState: UsersState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, search }: { page: number; search?: string }) => {
    const response = await getUsers({ skip: (page - 1) * 10, limit: 10, search });
    return response.data;
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ userId, data }: { userId: number; data: Partial<User> }) => {
    const response = await updateUser(userId, data);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.total = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Update User
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        if (!Array.isArray(state.users)) {
          state.users = [];
          return;
        }
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { setPage, setSearchQuery } = usersSlice.actions;
export default usersSlice.reducer;
