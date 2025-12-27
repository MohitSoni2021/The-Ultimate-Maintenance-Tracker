import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const createRequest = createAsyncThunk(
  'requests/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/requests', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMyRequests = createAsyncThunk(
  'requests/getMyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/requests/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTeamRequests = createAsyncThunk(
  'requests/getTeamRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/requests/team/requests');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllRequests = createAsyncThunk(
  'requests/getAllRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/requests/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRequestById = createAsyncThunk(
  'requests/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRequest = createAsyncThunk(
  'requests/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/requests/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    list: [],
    selectedRequest: null,
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRequest.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.createLoading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload?.error || 'Failed to create request';
      })
      .addCase(getMyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch requests';
      })
      .addCase(getTeamRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getTeamRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch team requests';
      })
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch all requests';
      })
      .addCase(getRequestById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(getRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch request';
      })
      .addCase(updateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((req) => req.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.selectedRequest = action.payload;
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update request';
      });
  },
});

export const { clearError, clearSelectedRequest } = requestSlice.actions;
export default requestSlice.reducer;
