import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, test, jest } from '@jest/globals';


class LocalStorageMock {
    private store: Record<string, string> = {};

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string) {
        this.store[key] = value;
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}


const mockStorage = new LocalStorageMock();


jest.spyOn(window.localStorage, 'getItem').mockImplementation(key => mockStorage.getItem(key));
jest.spyOn(window.localStorage, 'setItem').mockImplementation((key, value) => mockStorage.setItem(key, value));
jest.spyOn(window.localStorage, 'removeItem').mockImplementation(key => mockStorage.removeItem(key));
jest.spyOn(window.localStorage, 'clear').mockImplementation(() => mockStorage.clear());

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
    beforeEach(() => {
        mockStorage.clear();
    });

    test('initial state is unauthenticated', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.userRole).toBe(null);
    });

    test('login updates authentication state', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login('fake-token', 'User');
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.userRole).toBe('User');
        expect(mockStorage.getItem('token')).toBe('fake-token');
    });

    test('logout clears authentication state', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login('fake-token', 'User');
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.userRole).toBe(null);
        expect(mockStorage.getItem('token')).toBe(null);
    });
});