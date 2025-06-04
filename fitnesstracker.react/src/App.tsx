import { Box, Button, CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import ButtonAppBar from './components/AppBar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ExerciseCard from './components/ExerciseCard';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import './App.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  const { isDarkMode } = useTheme();

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

  const sampleExercises = Array(6).fill(null).map((_, index) => ({
    name: `Sample Exercise ${index + 1}`,
    notes: `Sample Notes for exercise ${index + 1}`,
  }));

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

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            justifyContent: 'right',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            p: 2,
          }}
        >
          <Button variant="contained" color="primary">Exercises</Button>
          <Button variant="contained" color="primary">Users</Button>
        </Box>

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
          {sampleExercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              exercise={exercise}
            />
          ))}
        </Box>
        <Footer />
      </Box>
    </MuiThemeProvider>
  );
}

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}