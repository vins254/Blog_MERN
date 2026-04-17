/**
 * Frontend Component Tests
 * 
 * Tool: Jest (test runner) + React Testing Library (component testing)
 * 
 * These tests verify that the React application:
 *   - Renders core UI components correctly
 *   - Routes to the correct pages
 *   - Displays form elements with proper attributes
 * 
 * Note: These are unit/integration tests for the React components.
 *       They do NOT make real API calls (fetch is mocked).
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';

// Mock fetch globally to prevent real API calls during tests
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve([]),
        })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

// ─────────────────────────────────────────────
// APP RENDERING TESTS
// ─────────────────────────────────────────────

describe('App Component', () => {
    test('renders the blog logo/brand', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        const logo = screen.getByText(/MyBlog/i);
        expect(logo).toBeInTheDocument();
    });

    test('renders login and register links when not authenticated', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        const loginLink = screen.getByText(/Login/i);
        const registerLink = screen.getByText(/Register/i);
        expect(loginLink).toBeInTheDocument();
        expect(registerLink).toBeInTheDocument();
    });
});

// ─────────────────────────────────────────────
// ROUTING TESTS
// ─────────────────────────────────────────────

describe('Routing', () => {
    test('renders login page at /login route', async () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );

        const heading = screen.getByText(/Welcome Back/i);
        expect(heading).toBeInTheDocument();
    });

    test('renders register page at /register route', async () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <App />
            </MemoryRouter>
        );

        const heading = screen.getByText(/Create Account/i);
        expect(heading).toBeInTheDocument();
    });
});

// ─────────────────────────────────────────────
// LOGIN FORM TESTS
// ─────────────────────────────────────────────

describe('Login Page', () => {
    test('renders username and password fields', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText(/Username/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);

        expect(usernameInput).toBeInTheDocument();
        expect(usernameInput).toHaveAttribute('type', 'text');
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('renders sign in button', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveAttribute('type', 'submit');
    });
});

// ─────────────────────────────────────────────
// REGISTER FORM TESTS
// ─────────────────────────────────────────────

describe('Register Page', () => {
    test('renders all registration fields', () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        // Password fields (there are multiple — check they exist)
        const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
        expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
    });

    test('renders sign up button', () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <App />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: /Sign Up/i });
        expect(submitButton).toBeInTheDocument();
    });
});
