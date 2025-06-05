import { Box } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                textAlign: 'center',
                p: 2,
                mt: 'auto', // pushes footer to bottom
                width: '100%',
                opacity: 0.5,
            }}
        >
            <p>© {new Date().getFullYear()} Fitness Tracker. All rights reserved.</p>
        </Box>
    );
};

export default Footer;