import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  Done as DoneIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  VolunteerActivism as VolunteerIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchDashboardStats, fetchAnalytics, updateVolunteerStatus, updateIncidentStatus, updateAlertStatus } from '../store/slices/dashboardSlice';
import { DashboardStats } from '../types/dashboard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box color="primary.main">{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const theme = useTheme();
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return theme.palette.warning.main;
      case 'approved':
      case 'verified':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      case 'resolved':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: alpha(getStatusColor(), 0.1),
        color: getStatusColor(),
        fontWeight: 'medium',
      }}
    />
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { stats, incidentAnalytics, alertAnalytics, loading, error } = useAppSelector((state) => state.dashboard);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAnalytics(timeRange));
  }, [dispatch, timeRange]);

  const handleVolunteerStatusUpdate = async (volunteerId: number, status: string) => {
    try {
      await dispatch(updateVolunteerStatus({ volunteerId, status }));
      dispatch(fetchDashboardStats());
    } catch (error) {
      console.error('Failed to update volunteer status:', error);
    }
  };

  const handleIncidentStatusUpdate = async (incidentId: string, status: string) => {
    try {
      await dispatch(updateIncidentStatus({ incidentId, status }));
      dispatch(fetchDashboardStats());
    } catch (error) {
      console.error('Failed to update incident status:', error);
    }
  };

  const handleAlertStatusUpdate = async (alertId: string, status: string) => {
    try {
      await dispatch(updateAlertStatus({ alertId, status }));
      dispatch(fetchDashboardStats());
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  // Ensure stats values are defined
  const totalStats = [
    { name: 'Users', value: stats.total_users || 0 },
    { name: 'Incidents', value: stats.total_incidents || 0 },
    { name: 'Alerts', value: stats.total_alerts || 0 },
    { name: 'Volunteers', value: stats.total_volunteers || 0 },
  ];

  const pendingData = [
    { name: 'Incidents', value: stats.pending_incidents || 0 },
    { name: 'Volunteers', value: stats.pending_volunteers || 0 },
  ];

  // Ensure analytics data is always an array
  const safeIncidentAnalytics = Array.isArray(incidentAnalytics) ? incidentAnalytics : [];
  const safeAlertAnalytics = Array.isArray(alertAnalytics) ? alertAnalytics : [];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img 
          src="/logo.png" 
          alt="Himrakshak Logo" 
          style={{ height: '50px', marginRight: '16px' }}
        />
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}>
          Dashboard Overview
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{stats.total_users}</Typography>
              <Typography color="textSecondary">Total Users</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ fontSize: 40, mr: 2, color: 'error.main' }} />
            <Box>
              <Typography variant="h6">{stats.total_incidents}</Typography>
              <Typography color="textSecondary">Total Incidents</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
            <Box>
              <Typography variant="h6">{stats.total_alerts}</Typography>
              <Typography color="textSecondary">Total Alerts</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <VolunteerIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
            <Box>
              <Typography variant="h6">{stats?.total_volunteers || 0}</Typography>
              <Typography color="textSecondary">Total Volunteers</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Total Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Total Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={totalStats.length > 0 ? totalStats : [{ name: 'No Data', value: 0 }]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pending Items */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Pending Items
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pendingData.length > 0 ? pendingData : [{ name: 'No Data', value: 0 }]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pendingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Incidents Over Time
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeIncidentAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Alerts Over Time
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeAlertAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="count" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Recent Incidents */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Incidents
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {stats.recent_incidents && stats.recent_incidents.map((incident) => (
                  <Box
                    key={incident._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {incident.title}
                      </Typography>
                      <StatusChip status={incident.status} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Reported by: {incident.reporter_name} ({incident.reporter_email})
                    </Typography>
                    {incident.verified_by_name && (
                      <Typography variant="body2" color="textSecondary">
                        Verified by: {incident.verified_by_name}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      {new Date(incident.created_at).toLocaleString()}
                    </Typography>
                    
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Alerts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Alerts
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {stats.recent_alerts && stats.recent_alerts.map((alert) => (
                  <Box
                    key={alert._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {alert.title}
                      </Typography>
                      <StatusChip status={alert.status || 'active'} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Created by: {alert.created_by_name} ({alert.created_by_email})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Severity: {alert.severity}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      {new Date(alert.created_at).toLocaleString()}
                    </Typography>
                    
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 