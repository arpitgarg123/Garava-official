import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminApi from "./admin.api";

// Async thunks for appointment admin operations
export const fetchAppointmentsAdmin = createAsyncThunk(
  "appointmentAdmin/fetchAppointments",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.listAppointmentsAdmin(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAppointmentAdmin = createAsyncThunk(
  "appointmentAdmin/updateAppointment",
  async ({ appointmentId, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.updateAppointment(appointmentId, updateData);
      return data.appointment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  appointments: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  filters: {
    status: '',
    serviceType: '',
    fromDate: '',
    toDate: '',
  },
  selectedAppointment: null,
  loading: false,
  operationLoading: false,
  error: null,
};

const appointmentAdminSlice = createSlice({
  name: "appointmentAdmin",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        serviceType: '',
        fromDate: '',
        toDate: '',
      };
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointmentsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.items || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchAppointmentsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update appointment
      .addCase(updateAppointmentAdmin.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateAppointmentAdmin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedAppointment = action.payload;
        
        // Update the appointment in the list
        const index = state.appointments.findIndex(
          appointment => appointment._id === updatedAppointment._id
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
        
        // Update selected appointment if it matches
        if (state.selectedAppointment?._id === updatedAppointment._id) {
          state.selectedAppointment = updatedAppointment;
        }
      })
      .addCase(updateAppointmentAdmin.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSelectedAppointment,
  clearError,
} = appointmentAdminSlice.actions;

export default appointmentAdminSlice.reducer;