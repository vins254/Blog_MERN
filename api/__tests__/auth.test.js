/**
 * Authentication API — Unit & Integration Tests
 * 
 * Tool: Jest (test runner) + Supertest (HTTP assertions)
 * 
 * These tests validate the authentication endpoints:
 *   POST /register — User registration with validation
 *   POST /login    — User login and session creation
 *   GET  /profile  — Retrieve authenticated user profile
 *   POST /logout   — Clear session cookie
 * 
 * Strategy:
 *   - Tests run against the real MongoDB Atlas database
 *   - A unique test user is created per run and cleaned up after
 *   - Cookie-based auth is tested by chaining requests
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Unique test user credentials per run to avoid collisions
const TEST_USER = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@test.com`,
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
};

let authCookie = '';

afterAll(async () => {
    // Cleanup: remove the test user from the database
    await User.deleteOne({ username: TEST_USER.username });
    await mongoose.connection.close();
});

// ─────────────────────────────────────────────
// REGISTRATION TESTS
// ─────────────────────────────────────────────

describe('POST /register', () => {
    test('should reject registration with missing fields', async () => {
        const res = await request(app)
            .post('/register')
            .send({ username: 'incomplete' })
            .expect(400);

        expect(res.body.message).toBe('All fields are required');
    });

    test('should reject registration with mismatched passwords', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'mismatchuser',
                email: 'mismatch@test.com',
                password: 'StrongPass123!',
                confirmPassword: 'DifferentPass456!',
            })
            .expect(400);

        expect(res.body.message).toBe('Passwords do not match');
    });

    test('should reject registration with weak password', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'weakuser',
                email: 'weak@test.com',
                password: '123',
                confirmPassword: '123',
            })
            .expect(400);

        expect(res.body.message).toMatch(/too weak/i);
    });

    test('should reject registration with invalid email format', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                username: 'bademail',
                email: 'not-an-email',
                password: 'StrongPass123!',
                confirmPassword: 'StrongPass123!',
            })
            .expect(400);

        expect(res.body.message).toBe('Invalid email format');
    });

    test('should successfully register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send(TEST_USER)
            .expect(200);

        expect(res.body.username).toBe(TEST_USER.username);
        expect(res.body.email).toBe(TEST_USER.email);
        expect(res.body.password).not.toBe(TEST_USER.password); // Should be hashed
    });

    test('should reject duplicate username registration', async () => {
        const res = await request(app)
            .post('/register')
            .send(TEST_USER)
            .expect(400);

        expect(res.body.message).toMatch(/already exists/i);
    });
});

// ─────────────────────────────────────────────
// LOGIN TESTS
// ─────────────────────────────────────────────

describe('POST /login', () => {
    test('should reject login with wrong username', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'nonexistent', password: 'whatever' })
            .expect(400);

        expect(res.body.message).toBe('Invalid username or password');
    });

    test('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: TEST_USER.username, password: 'WrongPassword1!' })
            .expect(400);

        expect(res.body.message).toBe('Invalid username or password');
    });

    test('should successfully login and return cookie', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: TEST_USER.username, password: TEST_USER.password })
            .expect(200);

        expect(res.body.username).toBe(TEST_USER.username);
        expect(res.body.id).toBeDefined();

        // Extract the auth cookie for subsequent requests
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        authCookie = cookies.map(c => c.split(';')[0]).join('; ');
    });
});

// ─────────────────────────────────────────────
// PROFILE TESTS
// ─────────────────────────────────────────────

describe('GET /profile', () => {
    test('should return 401 when not authenticated', async () => {
        const res = await request(app)
            .get('/profile')
            .expect(401);

        expect(res.body.message).toBe('Not logged in');
    });

    test('should return user profile when authenticated', async () => {
        const res = await request(app)
            .get('/profile')
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body.username).toBe(TEST_USER.username);
        expect(res.body.id).toBeDefined();
    });
});

// ─────────────────────────────────────────────
// LOGOUT TESTS
// ─────────────────────────────────────────────

describe('POST /logout', () => {
    test('should clear the auth cookie', async () => {
        const res = await request(app)
            .post('/logout')
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body).toBe('ok');

        // Verify the cookie is cleared (expires in the past)
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        expect(tokenCookie).toMatch(/token=;|token=j/);
    });
});
