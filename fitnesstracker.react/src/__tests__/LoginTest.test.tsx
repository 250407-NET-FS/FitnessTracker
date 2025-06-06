import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from '../components/Login';


const mockLogin = jest.fn();
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin
    })
}));

window.fetch = jest.fn() as jest.Mock;

describe('Login Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        (window.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ token: 'fake-token' })
        });
    });

    test('renders login form', () => {
        render(<Login onClose={jest.fn()} />);

        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Login$/ })).toBeInTheDocument();
    });

    test('submits form with credentials', async () => {
        const mockOnClose = jest.fn();
        render(<Login onClose={mockOnClose} />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: /^Login$/ });

        await userEvent.type(emailInput, 'test@test.com');
        await userEvent.type(passwordInput, 'Password123!');

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/login'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        username: 'test@test.com',
                        password: 'Password123!'
                    })
                })
            );
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('fake-token', expect.any(String));
        });

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});