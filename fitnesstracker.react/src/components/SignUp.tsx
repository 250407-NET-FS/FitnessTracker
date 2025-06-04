import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { API_BASE_URL } from '../utils/api';

interface SignUpProps {
    onClose: () => void;
    onSuccess: () => void;
}

const SignUp = ({ onClose, onSuccess }: SignUpProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isTrainer, setIsTrainer] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    isTrainer
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || 'Registration failed');
            }

            onSuccess();

        } catch (err) {
            console.error('Registration error:', err);
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Create Account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isTrainer}
                            onChange={(e) => setIsTrainer(e.target.checked)}
                            disabled={isLoading}
                            color="primary"
                        />
                    }
                    label="Sign up as a Trainer"
                />

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        endIcon={isLoading ? <CircularProgress size={24} /> : null}
                    >
                        {isLoading ? 'Creating Account...' : isTrainer ? 'Sign Up as Trainer' : 'Sign Up as User'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default SignUp;