import { Box } from '@mui/material';

const Banner = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '300px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                component="img"
                src="/banner.jpg"
                alt="Fitness Banner"
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
            />
        </Box>
    );
};

export default Banner;