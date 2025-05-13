import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, setPage, setSearchQuery } from '../store/slices/usersSlice';

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total, loading, error, currentPage, searchQuery } = useAppSelector((state) => state.users);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, search: searchQuery }));
  }, [dispatch, currentPage, searchQuery]);

  // Ensure users is an array before mapping
  const filteredUsers = Array.isArray(users) ? users.map(({ id, name, email, is_admin, is_volunteer }) => ({
    id,
    name,
    email,
    role: is_admin ? 'admin' : is_volunteer ? 'volunteer' : 'user',
  })) : [];

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      dispatch(setSearchQuery(searchInput));
      dispatch(setPage(1));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            sx={{ mb: 2 }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={
                          user.role === 'admin'
                            ? 'primary'
                            : user.role === 'volunteer'
                            ? 'secondary'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={currentPage - 1}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
