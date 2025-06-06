import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Alert, CircularProgress
} from '@mui/material';
import { fetchWithAuth } from '../utils/api';

interface CreateExerciseProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateExercise = ({ open, onClose, onSuccess }: CreateExerciseProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetMuscleGroup, setTargetMuscleGroup] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description || !targetMuscleGroup) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await fetchWithAuth('/exercises', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    description,
                    targetMuscleGroup
                }),
            });

            setName('');
            setDescription('');
            setTargetMuscleGroup('');

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create exercise');
            console.error('Error creating exercise:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setTargetMuscleGroup('');
        setError(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Create New Exercise</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Exercise Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={3}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Target Muscle Group"
                        value={targetMuscleGroup}
                        onChange={(e) => setTargetMuscleGroup(e.target.value)}
                        margin="normal"
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
                >
                    {isSubmitting ? 'Creating...' : 'Create Exercise'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateExercise;