import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const Login = ({ onClose }: { onClose: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log(`Attempting login with email: ${email}`);

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, // Keep as 'username' since backend expects this
                    password: password
                }),
            });

            if (!response.ok) {
                // Try to get detailed error message
                const errorData = await response.json().catch(() => null);
                console.error('Login failed response:', errorData);
                throw new Error(errorData?.detail || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful, received token');
            const token = data.token;

            login(token, getUserRoleFromToken(token));
            onClose();
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const getUserRoleFromToken = (token: string): string => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            if (roleClaim) {
                return Array.isArray(roleClaim) ? roleClaim[0] : roleClaim;
            }

            return 'User';
        } catch (e) {
            console.error('Failed to parse token:', e);
            return 'User';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
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
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Login;