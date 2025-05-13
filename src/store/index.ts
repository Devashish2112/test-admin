import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import usersReducer from './slices/usersSlice';
import incidentsReducer from './slices/incidentsSlice';
import alertsReducer from './slices/alertsSlice';
import volunteersReducer from './slices/volunteersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    incidents: incidentsReducer,
    alerts: alertsReducer,
    volunteers: volunteersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 