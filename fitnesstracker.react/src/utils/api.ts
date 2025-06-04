export const API_BASE_URL = 'http://localhost:5293';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
            }

            const errorText = await response.text();
            let errorMessage = 'API request failed';

            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.detail || errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
                errorMessage = errorText || `Error ${response.status}`;
                console.error('Failed to parse error response:', e);
            }

            throw new Error(errorMessage);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};

    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};