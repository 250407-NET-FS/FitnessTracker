import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Card, CardContent,
    CircularProgress, List, ListItem, ListItemText,
    IconButton, Dialog, DialogTitle, DialogContent,
    FormControl, InputLabel, Select, MenuItem,
    TextField, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchWithAuth } from '../utils/api';
import type { Exercise } from '../types/types';

const UserExercises = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [userExercises, setUserExercises] = useState<Exercise[]>([]);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [targetSets, setTargetSets] = useState<string>('');
    const [targetReps, setTargetReps] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    useEffect(() => {
        const fetchUserExercises = async () => {
            try {
                setLoading(true);
                const data = await fetchWithAuth(`/users/${userId}/exercises`);
                setUserExercises(data);
            } catch (err) {
                setError('Failed to load user exercises');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserExercises();
    }, [userId]);

    const handleAddExercise = async () => {
        try {
            const data = await fetchWithAuth('/exercises');
            const userExerciseIds = userExercises.map(ex => ex.id);
            setAvailableExercises(data.filter((ex: Exercise) => !userExerciseIds.includes(ex.id)));
            setOpenDialog(true);
        } catch (err) {
            setError('Failed to load available exercises');
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedExercise) return;

        try {
            const details = {
                targetSets: targetSets ? parseInt(targetSets) : null,
                targetReps: targetReps ? parseInt(targetReps) : null,
                notes: notes || null
            };

            await fetchWithAuth(`/users/${userId}/exercises/${selectedExercise}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(details),
            });

            const updatedExercises = await fetchWithAuth(`/users/${userId}/exercises`);
            setUserExercises(updatedExercises);

            setSelectedExercise('');
            setTargetSets('');
            setTargetReps('');
            setNotes('');
            setOpenDialog(false);
        } catch (err) {
            setError('Failed to assign exercise');
            console.error(err);
        }
    };

    const handleRemoveExercise = async (exerciseId: string) => {
        try {
            await fetchWithAuth(`/users/${userId}/exercises/${exerciseId}`, {
                method: 'DELETE'
            });

            setUserExercises(userExercises.filter(ex => ex.id !== exerciseId));
        } catch (err) {
            setError('Failed to remove exercise');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    User Exercise Management
                </Typography>
            </Box>

            {error && (
                <Card sx={{ mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <CardContent>
                        <Typography>{error}</Typography>
                    </CardContent>
                </Card>
            )}

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddExercise}
                    sx={{ mb: 2 }}
                >
                    Add Exercise
                </Button>

                {userExercises.length === 0 ? (
                    <Typography sx={{ mt: 2 }}>No exercises assigned to this user yet.</Typography>
                ) : (
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                        {userExercises.map((exercise) => (
                            <ListItem
                                key={exercise.id}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleRemoveExercise(exercise.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                divider
                            >
                                <ListItemText
                                    primary={exercise.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                {exercise.description}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Target: {exercise.targetMuscleGroup}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Exercise to User</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Assign Exercise
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserExercises;