import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const getAllEquipment = createAsyncThunk(
  'equipment/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/equipment', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEquipmentById = createAsyncThunk(
  'equipment/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEquipment = createAsyncThunk(
  'equipment/create',
  async (equipmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/equipment', equipmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  'equipment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/equipment/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'equipment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/equipment/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    list: [],
    selectedEquipment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEquipment: (state) => {
      state.selectedEquipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch equipment';
      })
      .addCase(getEquipmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEquipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEquipment = action.payload;
      })
      .addCase(getEquipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch equipment';
      })
      .addCase(createEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create equipment';
      })
      .addCase(updateEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update equipment';
      })
      .addCase(deleteEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete equipment';
      });
  },
});

export const { clearError, clearSelectedEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;
