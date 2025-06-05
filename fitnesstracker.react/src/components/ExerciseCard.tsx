import { Card, CardContent, CardMedia, Typography, Box, Button, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import type { Exercise } from '../types/types';

interface ExerciseCardProps {
    exercise: Exercise;
    onExerciseDeleted?: () => void;
}

const ExerciseCard = ({ exercise, onExerciseDeleted }: ExerciseCardProps) => {
    const { isAuthenticated, userRole } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = userRole === 'Admin';

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await fetchWithAuth(`/exercises/${exercise.id}`, {
                method: 'DELETE'
            });
            setOpenDialog(false);

            if (onExerciseDeleted) {
                onExerciseDeleted();
            }
        } catch (err) {
            console.error('Error deleting exercise:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out',
                },
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image="/placeholder.avif"
                alt={exercise.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {exercise.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    component="p"
                    sx={{ mb: 2 }}
                >
                    {exercise.description || 'No description available'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                        Target: {exercise.targetMuscleGroup}
                    </Typography>
                </Box>
            </CardContent>

            {isAuthenticated && isAdmin && (
                <CardActions sx={{ flexDirection: 'column', gap: 1, padding: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleDeleteClick}
                        fullWidth
                    >
                        Delete Exercise
                    </Button>
                </CardActions>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Exercise Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the exercise "{exercise.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ExerciseCard;