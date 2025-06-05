import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserCard from '../components/UserCard';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../utils/api';
import { waitFor } from '@testing-library/react';

jest.mock('../utils/api', () => ({
    fetchWithAuth: jest.fn().mockResolvedValue({}),
    API_BASE_URL: 'http://localhost:5293'
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        userRole: 'Admin',
        login: jest.fn(),
        logout: jest.fn()
    })
}));

const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
};

describe('UserCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders user information', () => {
        render(
            <BrowserRouter>
                <UserCard user={mockUser} onUserDeleted={jest.fn()} />
            </BrowserRouter>
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('renders manage exercises button for trainers', () => {
        render(
            <BrowserRouter>
                <UserCard user={mockUser} onUserDeleted={jest.fn()} />
            </BrowserRouter>
        );

        const manageButton = screen.getByText('Manage Exercises');
        expect(manageButton).toBeInTheDocument();
    });

    test('renders delete button for admins', () => {
        render(
            <BrowserRouter>
                <UserCard user={mockUser} onUserDeleted={jest.fn()} />
            </BrowserRouter>
        );

        const deleteButton = screen.getByText('Delete User');
        expect(deleteButton).toBeInTheDocument();
    });

    test('opens confirmation dialog when delete button is clicked', () => {
        render(
            <BrowserRouter>
                <UserCard user={mockUser} onUserDeleted={jest.fn()} />
            </BrowserRouter>
        );

        const deleteButton = screen.getByText('Delete User');
        fireEvent.click(deleteButton);

        expect(screen.getByText('Confirm User Deletion')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete Test User\?/)).toBeInTheDocument();
    });

    test('calls API and onUserDeleted when confirming deletion', async () => {
        const mockOnUserDeleted = jest.fn();

        render(
            <BrowserRouter>
                <UserCard user={mockUser} onUserDeleted={mockOnUserDeleted} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Delete User'));
        expect(screen.getByText('Confirm User Deletion')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(api.fetchWithAuth).toHaveBeenCalledWith('/users/1', { method: 'DELETE' });
        });

        await waitFor(() => {
            expect(mockOnUserDeleted).toHaveBeenCalled();
        });
    });
});