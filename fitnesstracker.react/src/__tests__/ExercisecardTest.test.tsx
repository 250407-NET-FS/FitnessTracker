import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExerciseCard from '../components/ExerciseCard';

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        userRole: 'User',
        login: jest.fn(),
        logout: jest.fn()
    })
}));

describe('ExerciseCard Component', () => {
    test('renders exercise information', () => {
        const mockExercise = {
            id: '1',
            name: 'Push-ups',
            description: 'Basic bodyweight exercise',
            targetMuscleGroup: 'Chest',
            createdAt: new Date().toISOString()
        };

        render(<ExerciseCard exercise={mockExercise} />);

        expect(screen.getByText('Push-ups')).toBeInTheDocument();
        expect(screen.getByText('Basic bodyweight exercise')).toBeInTheDocument();
    });
});