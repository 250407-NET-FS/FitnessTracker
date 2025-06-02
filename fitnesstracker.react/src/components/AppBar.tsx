import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Stack from '@mui/material/Stack';
import { useTheme } from '../context/ThemeContext';

export default function ButtonAppBar() {
    const { isDarkMode, toggleTheme } = useTheme();

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
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div">
                            FitnessTracker
                        </Typography>
                        <Button color="inherit">About</Button>
                        <Button color="inherit">Contact</Button>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            color="inherit"
                            onClick={toggleTheme}
                            aria-label="toggle theme"
                        >
                            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <Button color="inherit">Login</Button>
                        <Button color="inherit">Sign Up</Button>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
}