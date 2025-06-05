import { useState, useEffect } from 'react';
import {
  Box, Button, CssBaseline, ThemeProvider as MuiThemeProvider,
  createTheme, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ButtonAppBar from './components/AppBar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ExerciseCard from './components/ExerciseCard';
import UserCard from './components/UserCard';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import type { Exercise, User } from './types/types';
import { fetchWithAuth } from './utils/api';
import UserExercisesPage from './pages/UserExercisesPage';
import CreateExercise from './components/CreateExercise';

function App() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, userRole } = useAuth();
  const [view, setView] = useState<'exercises' | 'users'>('exercises');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const isTrainer = userRole === 'Admin' || userRole === 'Trainer';

  const handleCloseError = () => {
    setError(null);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/${view}`);
      if (view === 'exercises') {
        setExercises(data);
      } else {
        setUsers(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleUserDeleted = async () => {
    if (view === 'users') {
      fetchData();
    }
  };

  const handleCreateExercise = () => {
    setOpenCreateDialog(true);
  };

  const handleExerciseCreated = () => {
    setOpenCreateDialog(false);
    fetchData();
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#D3D3D3',
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          padding: 0,
          margin: 0,
        }}
      >
        <ButtonAppBar />
        <Banner />

        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Routes>
          <Route path="/" element={
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  width: '100%',
                  maxWidth: 1200,
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  p: 2,
                  mt: 2,
                }}
              >
                <Box>
                  {isAuthenticated && isTrainer && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      onClick={handleCreateExercise}
                      disabled={loading}
                    >
                      Create Exercise
                    </Button>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color={view === 'exercises' ? 'primary' : 'secondary'}
                    onClick={() => setView('exercises')}
                    disabled={loading}
                  >
                    Exercises
                  </Button>
                  <Button
                    variant="contained"
                    color={view === 'users' ? 'primary' : 'secondary'}
                    onClick={() => setView('users')}
                    disabled={loading}
                  >
                    Users
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '200px'
                }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 3,
                    p: 3,
                    width: '100%',
                    maxWidth: 1200,
                    margin: '0 auto',
                  }}
                >
                  {view === 'exercises' ? (
                    exercises.length > 0 ? (
                      exercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          onExerciseDeleted={fetchData}
                        />
                      ))
                    ) : (
                      <Box sx={{ gridColumn: 'span 3', textAlign: 'center', py: 4 }}>
                        No exercises found.
                      </Box>
                    )
                  ) : (
                    users.length > 0 ? (
                      users.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onUserDeleted={handleUserDeleted}
                        />
                      ))
                    ) : (
                      <Box sx={{ gridColumn: 'span 3', textAlign: 'center', py: 4 }}>
                        No users found.
                      </Box>
                    )
                  )}
                </Box>
              )}
            </>
          } />
          <Route path="/users/:userId/exercises" element={<UserExercisesPage />} />
        </Routes>

        <Footer />
      </Box>

      <CreateExercise
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={handleExerciseCreated}
      />
    </MuiThemeProvider>
  );
}

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}