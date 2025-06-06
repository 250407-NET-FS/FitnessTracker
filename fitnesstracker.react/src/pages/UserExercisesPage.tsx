import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button,
    IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl, InputLabel, MenuItem,
    Select, TextField, CircularProgress, Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import type { Exercise } from '../types/types';

const UserExercisesPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [targetSets, setTargetSets] = useState<string>('');
    const [targetReps, setTargetReps] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;

            try {
                const userData = await fetchWithAuth(`/users/${userId}`);
                setUserName(userData.name);
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const fetchUserExercises = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            console.log(`Fetching exercises for user: ${userId}`);
            const data = await fetchWithAuth(`/users/${userId}/exercises`);
            console.log('Received exercises:', data);
            setExercises(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching exercises:', err);
            setError(err instanceof Error ? err.message : 'Failed to load exercises');
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserExercises();
    }, [userId]);

    const handleAddExercise = async () => {
        try {
            const allExercises = await fetchWithAuth('/exercises');

            const userExerciseIds = exercises.map(ex => ex.id);
            const available = allExercises.filter((ex: Exercise) =>
                !userExerciseIds.includes(ex.id));

            setAvailableExercises(available);
            setOpenDialog(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load available exercises');
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedExercise) return;

        try {
            setError(null);
            const details = {
                targetSets: targetSets ? parseInt(targetSets) : null,
                targetReps: targetReps ? parseInt(targetReps) : null,
                notes: notes || null
            };

            await fetchWithAuth(`/users/${userId}/exercises/${selectedExercise}`, {
                method: 'POST',
                body: JSON.stringify(details),
            });

            setSelectedExercise('');
            setTargetSets('');
            setTargetReps('');
            setNotes('');

            setOpenDialog(false);

            setTimeout(() => {
                fetchUserExercises();
            }, 300);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign exercise');
            console.error('Error assigning exercise:', err);
        }
    };

    const handleRemoveExercise = async (exerciseId: string) => {
        try {
            setError(null);
            await fetchWithAuth(`/users/${userId}/exercises/${exerciseId}`, {
                method: 'DELETE'
            });

            setTimeout(() => {
                fetchUserExercises();
            }, 300);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove exercise');
            console.error('Error removing exercise:', err);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                        aria-label="back"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        {userName ? `${userName}'s Exercises` : `User Exercises`}
                    </Typography>
                </Box>
                {(userRole === 'Admin' || userRole === 'Trainer') && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddExercise}
                    >
                        Add Exercise
                    </Button>
                )}
            </Box>

            {error && (
                <Paper
                    sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: 'error.light',
                        color: 'error.contrastText'
                    }}
                >
                    <Typography>{error}</Typography>
                </Paper>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : exercises.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1">
                        No exercises assigned to this user yet.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {exercises.map((exercise) => (
                        <Grid key={exercise.id} sx={{ gridColumn: 'span 12' }}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {exercise.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {exercise.description}
                                            </Typography>
                                            <Typography variant="body2" color="primary">
                                                Target: {exercise.targetMuscleGroup}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleRemoveExercise(exercise.id)}
                                            aria-label="delete"
                                            sx={{ display: (userRole === 'Admin' || userRole === 'Trainer') ? 'flex' : 'none' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Assign Exercise to User</DialogTitle>
                <DialogContent>
                    {availableExercises.length === 0 ? (
                        <Typography sx={{ my: 2 }}>
                            No more exercises available to assign.
                        </Typography>
                    ) : (
                        <>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="exercise-select-label">Exercise</InputLabel>
                                <Select
                                    labelId="exercise-select-label"
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                    label="Exercise"
                                >
                                    {availableExercises.map((exercise) => (
                                        <MenuItem key={exercise.id} value={exercise.id}>
                                            {exercise.name} - {exercise.targetMuscleGroup}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                margin="normal"
                                label="Target Sets"
                                type="number"
                                fullWidth
                                value={targetSets}
                                onChange={(e) => setTargetSets(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                label="Target Reps"
                                type="number"
                                fullWidth
                                value={targetReps}
                                onChange={(e) => setTargetReps(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                label="Notes"
                                fullWidth
                                multiline
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={!selectedExercise || availableExercises.length === 0}
                    >
                        Assign Exercise
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserExercisesPage;