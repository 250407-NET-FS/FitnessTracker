import { useState } from 'react';
import { AppBar, Box, Button, IconButton, Modal, Stack, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import SignUp from './SignUp';

export default function ButtonAppBar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isAuthenticated, userRole, logout } = useAuth();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);

    const getLoginText = () => {
        if (!isAuthenticated) return 'Login';
        if (userRole === 'Trainer') return 'Trainer log out';
        if (userRole === 'Admin') return 'Admin log out';
        if (userRole === 'User') return 'User log out';
        return 'Log out';
    };

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
        } else {
            setOpenLoginModal(true);
        }
    };

    const handleSignUpSuccess = () => {
        setOpenSignUpModal(false);
        setOpenLoginModal(true);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ width: '100%' }}>
                <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Fitness Tracker
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={toggleTheme} color="inherit">
                            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        {!isAuthenticated && (
                            <Button color="inherit" onClick={() => setOpenSignUpModal(true)}>
                                Sign Up
                            </Button>
                        )}
                        <Button color="inherit" onClick={handleAuthAction}>
                            {getLoginText()}
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>


            <Modal
                open={openLoginModal}
                onClose={() => setOpenLoginModal(false)}
                aria-labelledby="login-modal"
                aria-describedby="login-form"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24
                }}>
                    <Login onClose={() => setOpenLoginModal(false)} />
                </Box>
            </Modal>


            <Modal
                open={openSignUpModal}
                onClose={() => setOpenSignUpModal(false)}
                aria-labelledby="signup-modal"
                aria-describedby="signup-form"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24
                }}>
                    <SignUp
                        onClose={() => setOpenSignUpModal(false)}
                        onSuccess={handleSignUpSuccess}
                    />
                </Box>
            </Modal>
        </Box>
    );
}