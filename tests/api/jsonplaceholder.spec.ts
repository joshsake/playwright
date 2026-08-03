import { test, expect } from '@playwright/test';

// Runs in the "api" project against https://jsonplaceholder.typicode.com (see playwright.config.ts).
// JSONPlaceholder is a fake REST API: writes return realistic responses but are not persisted.

test.describe('JSONPlaceholder — Reading Posts', () => {
  test('GET /posts returns 100 posts', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(posts).toHaveLength(100);
  });

  test('each post has the expected shape', async ({ request }) => {
    const response = await request.get('/posts');
    const posts = await response.json();
    for (const post of posts) {
      expect(post).toEqual(
        expect.objectContaining({
          userId: expect.any(Number),
          id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
        })
      );
    }
  });

  test('GET /posts/1 returns a single post', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    const post = await response.json();
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(post.title.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 filters posts by user', async ({ request }) => {
    const response = await request.get('/posts', { params: { userId: 1 } });
    const posts = await response.json();
    expect(posts).toHaveLength(10);
    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  });

  test('GET /posts/1/comments returns comments with valid emails', async ({ request }) => {
    const response = await request.get('/posts/1/comments');
    expect(response.status()).toBe(200);
    const comments = await response.json();
    expect(comments.length).toBeGreaterThan(0);
    for (const comment of comments) {
      expect(comment.postId).toBe(1);
      expect(comment.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    }
  });

  test('GET on a nonexistent post returns 404', async ({ request }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
  });
});

test.describe('JSONPlaceholder — Writing Posts', () => {
  test('POST /posts creates a post and echoes it back', async ({ request }) => {
    const newPost = {
      title: 'Playwright API testing',
      body: 'Testing REST endpoints without a browser.',
      userId: 7,
    };
    const response = await request.post('/posts', { data: newPost });
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toEqual(expect.objectContaining(newPost));
    expect(created.id).toEqual(expect.any(Number));
  });

  test('PUT /posts/1 replaces the post', async ({ request }) => {
    const replacement = {
      id: 1,
      title: 'Replaced title',
      body: 'Replaced body',
      userId: 1,
    };
    const response = await request.put('/posts/1', { data: replacement });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(replacement);
  });

  test('PATCH /posts/1 updates only the given field', async ({ request }) => {
    const response = await request.patch('/posts/1', { data: { title: 'Patched title' } });
    expect(response.status()).toBe(200);
    const patched = await response.json();
    expect(patched.title).toBe('Patched title');
    expect(patched.userId).toBe(1);
    expect(patched.body.length).toBeGreaterThan(0);
  });

  test('DELETE /posts/1 succeeds', async ({ request }) => {
    const response = await request.delete('/posts/1');
    expect(response.status()).toBe(200);
  });
});

test.describe('JSONPlaceholder — Users', () => {
  test('GET /users returns 10 users with valid contact info', async ({ request }) => {
    const response = await request.get('/users');
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).toHaveLength(10);
    for (const user of users) {
      expect(user.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
      expect(user.address.geo.lat).toMatch(/^-?\d+(\.\d+)?$/);
    }
  });

  test('GET /users/1/todos returns that user\'s todos', async ({ request }) => {
    const response = await request.get('/users/1/todos');
    expect(response.status()).toBe(200);
    const todos = await response.json();
    expect(todos.length).toBeGreaterThan(0);
    for (const todo of todos) {
      expect(todo.userId).toBe(1);
      expect(typeof todo.completed).toBe('boolean');
    }
  });
});
