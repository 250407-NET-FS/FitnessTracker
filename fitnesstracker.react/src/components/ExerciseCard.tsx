import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface ExerciseCardProps {
    exercise: {
        name: string;
        notes?: string;
    };
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
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
                <Typography variant="body2" color="text.secondary">
                    {exercise.notes || 'No description available'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ExerciseCard;