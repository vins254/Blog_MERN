/**
 * Post API — Unit & Integration Tests
 * 
 * Tool: Jest (test runner) + Supertest (HTTP assertions)
 * 
 * These tests validate the post CRUD endpoints:
 *   GET    /post      — List all posts
 *   POST   /post      — Create a new post (auth required)
 *   GET    /post/:id  — Get a single post
 *   PUT    /post      — Update a post (author only)
 *   DELETE /post/:id  — Delete a post (author only)
 * 
 * Strategy:
 *   - A test user is registered and logged in before all tests
 *   - A test post is created and used throughout the suite
 *   - All test data is cleaned up after the suite finishes
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');

const TEST_USER = {
    username: `postuser_${Date.now()}`,
    email: `postuser_${Date.now()}@test.com`,
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
};

let authCookie = '';
let testPostId = '';
let testUserId = '';

beforeAll(async () => {
    // Register and login to get auth cookie
    await request(app).post('/register').send(TEST_USER);

    const loginRes = await request(app)
        .post('/login')
        .send({ username: TEST_USER.username, password: TEST_USER.password });

    testUserId = loginRes.body.id;
    const cookies = loginRes.headers['set-cookie'];
    authCookie = cookies.map(c => c.split(';')[0]).join('; ');
}, 20000);

afterAll(async () => {
    // Cleanup test data
    if (testPostId) {
        await Post.findByIdAndDelete(testPostId);
    }
    await User.deleteOne({ username: TEST_USER.username });
    await mongoose.connection.close();
});

// ─────────────────────────────────────────────
// CREATE POST TESTS
// ─────────────────────────────────────────────

describe('POST /post', () => {
    test('should reject post creation without authentication', async () => {
        const res = await request(app)
            .post('/post')
            .field('title', 'Unauthorized Post')
            .field('summary', 'Should fail')
            .field('content', '<p>No auth</p>')
            .expect(401);

        expect(res.body.message).toBe('Not logged in');
    });

    test('should create a post when authenticated', async () => {
        const res = await request(app)
            .post('/post')
            .set('Cookie', authCookie)
            .field('title', 'Test Post Title')
            .field('summary', 'Test post summary for integration testing')
            .field('content', '<p>Test post content body</p>')
            .field('category', 'Tech')
            .expect(200);

        expect(res.body.title).toBe('Test Post Title');
        expect(res.body.summary).toBe('Test post summary for integration testing');
        expect(res.body.category).toBe('Tech');
        expect(res.body.author).toBe(testUserId);
        testPostId = res.body._id;
    });
});

// ─────────────────────────────────────────────
// GET POSTS TESTS
// ─────────────────────────────────────────────

describe('GET /post', () => {
    test('should return an array of posts', async () => {
        const res = await request(app)
            .get('/post')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    test('each post should have required fields', async () => {
        const res = await request(app)
            .get('/post')
            .expect(200);

        const post = res.body.find(p => p._id === testPostId);
        expect(post).toBeDefined();
        expect(post.title).toBe('Test Post Title');
        expect(post.author).toBeDefined();
        expect(post.author.username).toBe(TEST_USER.username);
    });
});

// ─────────────────────────────────────────────
// GET SINGLE POST TESTS
// ─────────────────────────────────────────────

describe('GET /post/:id', () => {
    test('should return a single post by ID', async () => {
        const res = await request(app)
            .get(`/post/${testPostId}`)
            .expect(200);

        expect(res.body._id).toBe(testPostId);
        expect(res.body.title).toBe('Test Post Title');
        expect(res.body.author.username).toBe(TEST_USER.username);
    });

    test('should return 404 for non-existent post', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/post/${fakeId}`)
            .expect(404);
    });

    test('should return 400 for invalid ID format', async () => {
        const res = await request(app)
            .get('/post/invalid-id-format')
            .expect(400);
    });
});

// ─────────────────────────────────────────────
// UPDATE POST TESTS
// ─────────────────────────────────────────────

describe('PUT /post', () => {
    test('should reject update without authentication', async () => {
        const res = await request(app)
            .put('/post')
            .field('id', testPostId)
            .field('title', 'Unauthorized Update')
            .field('summary', 'Should fail')
            .field('content', '<p>No auth</p>')
            .expect(401);
    });

    test('should update a post when authenticated as author', async () => {
        const res = await request(app)
            .put('/post')
            .set('Cookie', authCookie)
            .field('id', testPostId)
            .field('title', 'Updated Test Post')
            .field('summary', 'Updated summary')
            .field('content', '<p>Updated content</p>')
            .field('category', 'Science')
            .expect(200);

        expect(res.body.title).toBe('Updated Test Post');
        expect(res.body.category).toBe('Science');
    });
});

// ─────────────────────────────────────────────
// DELETE POST TESTS
// ─────────────────────────────────────────────

describe('DELETE /post/:id', () => {
    test('should reject deletion without authentication', async () => {
        const res = await request(app)
            .delete(`/post/${testPostId}`)
            .expect(401);
    });

    test('should delete a post when authenticated as author', async () => {
        const res = await request(app)
            .delete(`/post/${testPostId}`)
            .set('Cookie', authCookie)
            .expect(200);

        expect(res.body).toBe('ok');
        testPostId = ''; // Prevent afterAll from trying to delete again
    });

    test('should return 404 when deleting already-deleted post', async () => {
        // Create a temporary post to get a valid (but deleted) ID
        const createRes = await request(app)
            .post('/post')
            .set('Cookie', authCookie)
            .field('title', 'Temp Post')
            .field('summary', 'Temp')
            .field('content', '<p>Temp</p>');

        const tempId = createRes.body._id;

        // Delete it
        await request(app)
            .delete(`/post/${tempId}`)
            .set('Cookie', authCookie)
            .expect(200);

        // Try to delete again
        const res = await request(app)
            .delete(`/post/${tempId}`)
            .set('Cookie', authCookie)
            .expect(404);
    });
});
