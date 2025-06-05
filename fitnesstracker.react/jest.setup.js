import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}


if (Object.getOwnPropertyDescriptor(window, 'location')?.configurable) {
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
            reload: jest.fn(),
            replace: jest.fn(),
            assign: jest.fn(),
            href: '/',
            origin: 'http://localhost'
        }
    });
}


const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();


if (Object.getOwnPropertyDescriptor(window, 'localStorage')?.configurable) {
    Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: localStorageMock
    });
}


global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));