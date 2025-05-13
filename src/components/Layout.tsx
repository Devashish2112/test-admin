import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Warning as IncidentIcon,
  NotificationsActive as AlertIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const dashboardMenu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
];

const userManagementMenu = [
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Volunteers', icon: <PersonAddIcon />, path: '/volunteers' },
];

const incidentManagementMenu = [
  { text: 'Incidents', icon: <IncidentIcon />, path: '/incidents' },
];

const alertManagementMenu = [
  { text: 'Alerts', icon: <AlertIcon />, path: '/alerts' },
];

const Layout: React.FC<LayoutProps> = ({ children, onThemeToggle, isDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      borderRight: 'none',
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
          <Typography variant="h6" noWrap component="div" sx={{ 
            fontWeight: 'bold', 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Himrakshak
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: theme.palette.primary.main }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mx: 2 }} />
      
      <Box sx={{ 
        flexGrow: 1, 
        px: 2, 
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 1, 
            mb: 1, 
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: 1,
          }}
        >
          MAIN
        </Typography>
        <List sx={{ mb: 2 }}>
          {dashboardMenu.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      width: 4,
                      height: '60%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 4px 4px 0',
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography 
          variant="overline" 
          sx={{ 
            px: 1, 
            mb: 1, 
            mt: 2,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: 1,
          }}
        >
          USER MANAGEMENT
        </Typography>
        <List sx={{ mb: 2 }}>
          {userManagementMenu.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      width: 4,
                      height: '60%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 4px 4px 0',
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography 
          variant="overline" 
          sx={{ 
            px: 1, 
            mb: 1, 
            mt: 2,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: 1,
          }}
        >
          INCIDENT MANAGEMENT
        </Typography>
        <List sx={{ mb: 2 }}>
          {incidentManagementMenu.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      width: 4,
                      height: '60%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 4px 4px 0',
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography 
          variant="overline" 
          sx={{ 
            px: 1, 
            mb: 1, 
            mt: 2,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: 1,
          }}
        >
          ALERT MANAGEMENT
        </Typography>
        <List sx={{ mb: 2 }}>
          {alertManagementMenu.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      width: 4,
                      height: '60%',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '0 4px 4px 0',
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ 
        p: 2, 
        mt: 'auto', 
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        }}>
          <Avatar 
            src="/avatar.png"
            alt="User Avatar"
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid',
              borderColor: theme.palette.primary.main,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'admin@himrakshak.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 'none',
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: theme.palette.text.primary }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                display: { xs: 'block', md: 'none' }, 
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }}
            >
              Himrakshak
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton 
                onClick={onThemeToggle} 
                sx={{ 
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                  mr: 1
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              Logout
            </Button>
            
            <IconButton
              color="primary"
              onClick={handleLogout}
              sx={{ 
                display: { xs: 'flex', sm: 'none' } 
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '5px 0 10px rgba(0, 0, 0, 0.05)',
              padding: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '5px 0 10px rgba(0, 0, 0, 0.05)',
              padding: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          p: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            overflow: 'visible',
            mt: 1,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: -5,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
          <AccountIcon fontSize="small" />
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
          <SettingsIcon fontSize="small" />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: theme.palette.error.main }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 