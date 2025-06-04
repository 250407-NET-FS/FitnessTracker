import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import type { User } from '../types/types';

interface UserCardProps {
    user: User;
}

const UserCard = ({ user }: UserCardProps) => {
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
        </Card>
    );
};

export default UserCard;