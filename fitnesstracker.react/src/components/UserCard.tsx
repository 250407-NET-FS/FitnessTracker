import { Card, CardContent, CardMedia, Typography, Button, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import type { User } from '../types/types';

interface UserCardProps {
    user: User;
    onUserDeleted?: () => void;
}

const UserCard = ({ user, onUserDeleted }: UserCardProps) => {
    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isTrainer = userRole === 'Admin' || userRole === 'Trainer';
    const isAdmin = userRole === 'Admin';

    const handleViewExercises = () => {
        navigate(`/users/${user.id}/exercises`);
    };

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await fetchWithAuth(`/users/${user.id}`, {
                method: 'DELETE'
            });
            setOpenDialog(false);

            if (onUserDeleted) {
                onUserDeleted();
            }
        } catch (err) {
            console.error('Error deleting user:', err);
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
                image="/user-placeholder.webp"
                alt={user.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.email}
                </Typography>
            </CardContent>
            {isAuthenticated && (
                <CardActions sx={{ flexDirection: 'column', gap: 1, padding: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleViewExercises}
                        fullWidth
                    >
                        {isTrainer ? 'Manage Exercises' : 'View Exercises'}
                    </Button>

                    {isAdmin && (
                        <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={handleDeleteClick}
                            fullWidth
                        >
                            Delete User
                        </Button>
                    )}
                </CardActions>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm User Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete {user.name}? This action cannot be undone.
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

export default UserCard;